from django.urls import path
from .views import GroupListCreateView, GroupDetailView, InviteMemberView, RemoveMemberView

urlpatterns = [
    path('', GroupListCreateView.as_view(), name='group_list_create'),
    path('<uuid:pk>/', GroupDetailView.as_view(), name='group_detail'),
    path('<uuid:pk>/invite/', InviteMemberView.as_view(), name='invite_member'),
    path('<uuid:pk>/members/<uuid:user_id>/remove/', RemoveMemberView.as_view(), name='remove_member'),
]
