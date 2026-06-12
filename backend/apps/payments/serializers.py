from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Payment
from apps.users.serializers import UserSerializer

User = get_user_model()


class PaymentSerializer(serializers.ModelSerializer):
    payer = UserSerializer(read_only=True)
    payee = UserSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'payer', 'payee', 'amount', 'group', 'note', 'date', 'created_at']


class CreatePaymentSerializer(serializers.Serializer):
    payee_id = serializers.UUIDField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    group_id = serializers.UUIDField(required=False, allow_null=True)
    note = serializers.CharField(required=False, allow_blank=True, default='')
    date = serializers.DateField()

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be positive.")
        return value

    def create(self, validated_data):
        from apps.groups.models import Group
        request_user = self.context['request'].user
        payee = User.objects.get(id=validated_data['payee_id'])
        group_id = validated_data.get('group_id')
        group = Group.objects.get(id=group_id) if group_id else None
        return Payment.objects.create(
            payer=request_user,
            payee=payee,
            amount=validated_data['amount'],
            group=group,
            note=validated_data.get('note', ''),
            date=validated_data['date'],
            created_by=request_user,
        )
