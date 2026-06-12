from django.urls import path
from .views import GroupBalanceView, UserBalanceSummaryView, FriendBalanceView

urlpatterns = [
    path('user/', UserBalanceSummaryView.as_view(), name='user_balance_summary'),
    path('group/<uuid:group_id>/', GroupBalanceView.as_view(), name='group_balance'),
    path('friend/<uuid:friend_id>/', FriendBalanceView.as_view(), name='friend_balance'),
]
