from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

User = get_user_model()


class ConversationListView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.conversations.prefetch_related(
            'participants', 'messages'
        ).order_by('-updated_at')


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def start_conversation(request):
    """Start or get existing conversation with another user"""
    other_user_id = request.data.get('user_id')
    
    try:
        other_user = User.objects.get(id=other_user_id)
    except User.DoesNotExist:
        return Response({'error': 'Пользователь не найден.'}, status=404)

    if other_user == request.user:
        return Response({'error': 'Нельзя начать диалог с самим собой.'}, status=400)

    # Find existing conversation
    conversation = Conversation.objects.filter(
        participants=request.user
    ).filter(
        participants=other_user
    ).first()

    if not conversation:
        conversation = Conversation.objects.create()
        conversation.participants.add(request.user, other_user)

    return Response(
        ConversationSerializer(conversation, context={'request': request}).data
    )


class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conv_id = self.kwargs['conv_id']
        # Verify user is participant
        try:
            conv = Conversation.objects.get(id=conv_id, participants=self.request.user)
        except Conversation.DoesNotExist:
            return Message.objects.none()

        # Mark messages as read
        conv.messages.filter(is_read=False).exclude(
            sender=self.request.user
        ).update(is_read=True)

        return conv.messages.select_related('sender')

    def perform_create(self, serializer):
        conv_id = self.kwargs['conv_id']
        conversation = Conversation.objects.get(
            id=conv_id, participants=self.request.user
        )
        msg = serializer.save(sender=self.request.user, conversation=conversation)
        # Update conversation timestamp
        conversation.save()
        return msg
