"""
AWS Lambda handler for Live Globe Databricks integration.
Provides API endpoints to fetch sales data from Databricks SQL Warehouse.
"""

import os
import json
import logging
from datetime import datetime, timedelta
from typing import Any

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Lazy import for databricks-sql-connector (cold start optimization)
_connection = None


def get_db_connection():
    """Get or create Databricks SQL connection."""
    global _connection
    
    if _connection is None:
        from databricks import sql
        
        _connection = sql.connect(
            server_hostname=os.environ["DATABRICKS_HOST"],
            http_path=os.environ["DATABRICKS_HTTP_PATH"],
            access_token=os.environ["DATABRICKS_TOKEN"]
        )
    
    return _connection


def cors_response(status_code: int, body: Any) -> dict:
    """Create a CORS-enabled response."""
    return {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Origin": os.environ.get("ALLOWED_ORIGIN", "*"),
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json"
        },
        "body": json.dumps(body, default=str)
    }


def handle_options(event: dict) -> dict:
    """Handle CORS preflight requests."""
    return cors_response(200, {"message": "OK"})


def get_aggregated_stats(cursor) -> dict:
    """Fetch aggregated statistics from Databricks."""
    cursor.execute("""
        SELECT 
            COUNT(*) as total_orders,
            SUM(gmv) as total_gmv,
            COUNT(DISTINCT store_id) as total_stores,
            AVG(ticket_value) as avg_ticket
        FROM gold.sales_aggregated
        WHERE sale_date >= current_date() - INTERVAL 1 DAY
    """)
    
    row = cursor.fetchone()
    if row:
        return {
            "totalOrders": int(row[0] or 0),
            "totalGMV": float(row[1] or 0),
            "totalStores": int(row[2] or 0),
            "avgTicket": float(row[3] or 0)
        }
    return {"totalOrders": 0, "totalGMV": 0, "totalStores": 0, "avgTicket": 0}


def get_stats_by_state(cursor) -> list:
    """Fetch statistics grouped by state."""
    cursor.execute("""
        SELECT 
            state,
            COUNT(*) as orders,
            SUM(gmv) as gmv,
            COUNT(DISTINCT store_id) as stores
        FROM gold.sales_aggregated
        WHERE sale_date >= current_date() - INTERVAL 1 DAY
        GROUP BY state
        ORDER BY gmv DESC
    """)
    
    results = []
    for row in cursor.fetchall():
        results.append({
            "state": row[0],
            "orders": int(row[1]),
            "gmv": float(row[2]),
            "stores": int(row[3])
        })
    return results


def get_stats_by_channel(cursor) -> list:
    """Fetch statistics grouped by sales channel."""
    cursor.execute("""
        SELECT 
            channel,
            COUNT(*) as orders,
            SUM(gmv) as gmv
        FROM gold.sales_aggregated
        WHERE sale_date >= current_date() - INTERVAL 1 DAY
        GROUP BY channel
        ORDER BY orders DESC
    """)
    
    results = []
    for row in cursor.fetchall():
        results.append({
            "channel": row[0],
            "orders": int(row[1]),
            "gmv": float(row[2])
        })
    return results


def get_recent_sales(cursor, limit: int = 20) -> list:
    """Fetch recent sales for the live feed."""
    cursor.execute(f"""
        SELECT 
            sale_id,
            store_name,
            city,
            state,
            channel,
            sale_value,
            product_segment,
            uses_nuvempay,
            uses_nuvemenvios,
            is_first_sale,
            sale_timestamp
        FROM gold.recent_sales
        ORDER BY sale_timestamp DESC
        LIMIT {int(limit)}
    """)
    
    results = []
    for row in cursor.fetchall():
        results.append({
            "id": row[0],
            "storeName": row[1],
            "city": row[2],
            "state": row[3],
            "channel": row[4],
            "value": float(row[5]),
            "segment": row[6],
            "usesNuvemPay": bool(row[7]),
            "usesNuvemEnvios": bool(row[8]),
            "isFirstSale": bool(row[9]),
            "timestamp": row[10].isoformat() if row[10] else None
        })
    return results


def get_solutions_stats(cursor) -> dict:
    """Fetch NuvemPay and NuvemEnvios adoption stats."""
    cursor.execute("""
        SELECT 
            SUM(CASE WHEN uses_nuvempay THEN 1 ELSE 0 END) as nuvempay_count,
            SUM(CASE WHEN uses_nuvemenvios THEN 1 ELSE 0 END) as nuvemenvios_count,
            COUNT(*) as total
        FROM gold.sales_aggregated
        WHERE sale_date >= current_date() - INTERVAL 1 DAY
    """)
    
    row = cursor.fetchone()
    if row:
        total = int(row[2] or 1)
        return {
            "nuvemPay": {
                "count": int(row[0] or 0),
                "percentage": round((int(row[0] or 0) / total) * 100, 1)
            },
            "nuvemEnvios": {
                "count": int(row[1] or 0),
                "percentage": round((int(row[1] or 0) / total) * 100, 1)
            }
        }
    return {"nuvemPay": {"count": 0, "percentage": 0}, "nuvemEnvios": {"count": 0, "percentage": 0}}


def handler(event: dict, context: Any) -> dict:
    """Main Lambda handler."""
    
    # Handle CORS preflight
    http_method = event.get("httpMethod", event.get("requestContext", {}).get("http", {}).get("method", "GET"))
    if http_method == "OPTIONS":
        return handle_options(event)
    
    # Get path
    path = event.get("path", event.get("rawPath", "/stats"))
    query_params = event.get("queryStringParameters") or {}
    
    logger.info(f"Request: {http_method} {path}")
    
    try:
        conn = get_db_connection()
        
        with conn.cursor() as cursor:
            if path == "/stats" or path == "/":
                # Return all aggregated stats
                data = {
                    "aggregated": get_aggregated_stats(cursor),
                    "byState": get_stats_by_state(cursor),
                    "byChannel": get_stats_by_channel(cursor),
                    "solutions": get_solutions_stats(cursor),
                    "timestamp": datetime.utcnow().isoformat()
                }
                return cors_response(200, data)
            
            elif path == "/sales/recent":
                limit = int(query_params.get("limit", 20))
                limit = min(limit, 100)  # Cap at 100
                data = get_recent_sales(cursor, limit)
                return cors_response(200, {"sales": data, "timestamp": datetime.utcnow().isoformat()})
            
            elif path.startswith("/states/"):
                state_code = path.split("/")[-1].upper()
                cursor.execute("""
                    SELECT 
                        state,
                        city,
                        COUNT(*) as orders,
                        SUM(gmv) as gmv,
                        COUNT(DISTINCT store_id) as stores
                    FROM gold.sales_aggregated
                    WHERE state = %s AND sale_date >= current_date() - INTERVAL 1 DAY
                    GROUP BY state, city
                    ORDER BY gmv DESC
                    LIMIT 10
                """, (state_code,))
                
                cities = []
                for row in cursor.fetchall():
                    cities.append({
                        "city": row[1],
                        "orders": int(row[2]),
                        "gmv": float(row[3]),
                        "stores": int(row[4])
                    })
                
                return cors_response(200, {"state": state_code, "cities": cities})
            
            else:
                return cors_response(404, {"error": "Not found"})
    
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return cors_response(500, {"error": "Internal server error", "message": str(e)})
