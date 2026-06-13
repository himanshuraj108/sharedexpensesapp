"""
Automatically resolves all pending CSV anomalies in the database
according to the recommended business rules.
"""
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from core.models import CSVAnomaly
from core.views import ResolveAnomalyView
from rest_framework.test import APIRequestFactory, force_authenticate

User = get_user_model()
try:
    aisha = User.objects.get(username='Aisha')
except User.DoesNotExist:
    print("User Aisha does not exist. Please run reset_db.py first.")
    exit(1)

anomalies = list(CSVAnomaly.objects.filter(status='PENDING'))
if not anomalies:
    print("No pending anomalies found in the database.")
    exit(0)

print(f"Found {len(anomalies)} pending anomalies. Starting auto-resolution...")

factory = APIRequestFactory()

for anomaly in anomalies:
    atype = anomaly.anomaly_type
    
    # Recommended business rules mapping
    if atype in ('DUPLICATE', 'ZERO_AMOUNT'):
        action = 'REJECT'
        edited_data = {}
    elif atype == 'SETTLEMENT_DISGUISED_AS_EXPENSE':
        action = 'APPROVE'
        edited_data = {'payee': 'Aisha'}  # Rohan paid Aisha back
    elif atype == 'CURRENCY_MISMATCH':
        action = 'APPROVE'
        edited_data = {'exchange_rate': '83.0'}
    elif atype == 'MISSING_DATA':
        action = 'APPROVE'
        edited_data = {'paid_by': 'Aisha'}  # Set default payer for Row 12 missing payer
    else:
        action = 'APPROVE'
        edited_data = {}

    request = factory.post(f'/api/imports/anomalies/{anomaly.id}/resolve/', {
        'action': action,
        'edited_data': edited_data
    }, format='json')
    
    force_authenticate(request, user=aisha)
    
    view = ResolveAnomalyView.as_view()
    response = view(request, pk=str(anomaly.id))
    
    if response.status_code == 200:
        print(f"  Row {anomaly.row_index:2d} | [{atype:30s}] resolved to {action:7s} -> Success")
    else:
        print(f"  Row {anomaly.row_index:2d} | [{atype:30s}] failed -> {response.data}")

print("\n=== AUTO-RESOLUTION COMPLETE ===")
print("Please refresh your browser page to view updated balances and ledger.")
