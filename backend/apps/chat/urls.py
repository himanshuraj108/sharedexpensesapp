from django.urls import path
from .views import MessageListCreateView

urlpatterns = [
    path('<uuid:expense_id>/messages/', MessageListCreateView.as_view(), name='message_list_create'),
]
