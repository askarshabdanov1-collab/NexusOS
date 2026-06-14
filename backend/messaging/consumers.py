import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conv_id = self.scope['url_route']['kwargs']['conv_id']
        self.room_group_name = f'chat_{self.conv_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type', 'message')

        if message_type == 'message':
            content = data.get('content', '')
            user = self.scope['user']

            if user.is_authenticated and content:
                message = await self.save_message(user, content)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'id': message.id,
                        'content': message.content,
                        'sender_id': user.id,
                        'sender_name': user.full_name,
                        'created_at': message.created_at.isoformat(),
                    }
                )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'id': event['id'],
            'content': event['content'],
            'sender_id': event['sender_id'],
            'sender_name': event['sender_name'],
            'created_at': event['created_at'],
        }))

    @database_sync_to_async
    def save_message(self, user, content):
        from .models import Conversation, Message
        try:
            conversation = Conversation.objects.get(
                id=self.conv_id, participants=user
            )
            msg = Message.objects.create(
                conversation=conversation,
                sender=user,
                content=content
            )
            conversation.save()
            return msg
        except Conversation.DoesNotExist:
            return None
