import pika
import os
import json
from aliexpress import AliExpressAPI

def main():
    # Connect to RabbitMQ
    connection = pika.BlockingConnection(pika.URLParameters(os.getenv("RABBITMQ_URL")))
    channel = connection.channel()
    
    # Declare queue
    channel.queue_declare(queue="product_searches", durable=True)
    
    # Initialize API
    api = AliExpressAPI()

    def callback(ch, method, properties, body):
        search_query = json.loads(body)
        print(f"Processing: {search_query}")
        results = api.search_products(search_query["keyWord"])
        
        # Send to price tracker queue
        if results:
            channel.basic_publish(
                exchange="",
                routing_key="price_updates",
                body=json.dumps({"source": "AliExpress", "data": results})
            )
            print(f"Sent {len(results)} items to price tracker")
    
    # Consume messages
    channel.basic_consume(
        queue="product_searches",
        on_message_callback=callback,
        auto_ack=True
    )
    
    print("AliExpress service waiting for messages...")
    channel.start_consuming()

if __name__ == "__main__":
    main()