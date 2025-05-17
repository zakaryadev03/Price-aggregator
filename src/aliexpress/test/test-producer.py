import pika
import json
import os
from dotenv import load_dotenv

load_dotenv()

# RabbitMQ connection
connection = pika.BlockingConnection(
    pika.URLParameters(os.getenv("RABBITMQ_URL"))
)
channel = connection.channel()


channel.queue_declare(queue="product_searches", durable=True)
channel.queue_declare(queue="price_updates", durable=True)


test_queries = [
    {"keyWord": "wireless headphones"},
    {"keyWord": "iphone 15 case"},  
    {"keyWord": "yoga mat"}             
]

for query in test_queries:
    channel.basic_publish(
        exchange='',
        routing_key='product_searches',
        body=json.dumps(query),
        properties=pika.BasicProperties(
        delivery_mode=2  # make message persistent
        )
    )
    print(f"Sent query: {query['keyWord']}")

connection.close()
print("All test messages sent!")