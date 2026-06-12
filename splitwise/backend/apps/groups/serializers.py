from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Group, GroupMember
# pyrefly: ignore [missing-import]
from apps.users.serializers import UserSerializer

User = get_user_model()


class GroupMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = GroupMember
        fields = ['id', 'user', 'role', 'joined_at']


class GroupSerializer(serializers.ModelSerializer):
    members = GroupMemberSerializer(many=True, read_only=True)
    member_count = serializers.SerializerMethodField()
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'group_type', 'created_by',
                  'members', 'member_count', 'created_at', 'simplify_debts']
        read_only_fields = ['id', 'created_by', 'created_at']

    def get_member_count(self, obj):
        return obj.members.count()


class CreateGroupSerializer(serializers.ModelSerializer):
    member_emails = serializers.ListField(
        child=serializers.EmailField(), write_only=True, required=False, default=[]
    )

    class Meta:
        model = Group
        fields = ['name', 'description', 'group_type', 'member_emails', 'simplify_debts']

    def create(self, validated_data):
        member_emails = validated_data.pop('member_emails', [])
        request_user = self.context['request'].user
        group = Group.objects.create(created_by=request_user, **validated_data)
        # Add creator as admin
        GroupMember.objects.create(group=group, user=request_user, role='admin')
        # Add other members
        for email in member_emails:
            try:
                user = User.objects.get(email=email)
                if user != request_user:
                    GroupMember.objects.get_or_create(group=group, user=user, defaults={'role': 'member'})
            except User.DoesNotExist:
                pass
        return group


class InviteMemberSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email.")
        group = self.context['group']
        if GroupMember.objects.filter(group=group, user=user).exists():
            raise serializers.ValidationError("User is already a member of this group.")
        return value
