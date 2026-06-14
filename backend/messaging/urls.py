from django.urls import path
from . import views

urlpatterns = [
    path('conversations/', views.ConversationListView.as_view(), name='conversation-list'),
    path('conversations/start/', views.start_conversation, name='start-conversation'),
    path('conversations/<int:conv_id>/messages/', views.MessageListCreateView.as_view(), name='message-list'),
]
