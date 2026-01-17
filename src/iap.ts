import { InAppPurchase2, IAPProduct } from '@awesome-cordova-plugins/in-app-purchase-2';

export function initIAP() {
  document.addEventListener('deviceready', () => {
    // ✅ LES 4 ABONNEMENTS avec les IDs CORRECTS
    InAppPurchase2.register([
      { id: 'amaliessentielv2', type: InAppPurchase2.PAID_SUBSCRIPTION },
      { id: 'amalielitev2', type: InAppPurchase2.PAID_SUBSCRIPTION },
      { id: 'amaliprestigev2', type: InAppPurchase2.PAID_SUBSCRIPTION },
      { id: 'amaliprestigefemmev2', type: InAppPurchase2.PAID_SUBSCRIPTION },
    ]);

    InAppPurchase2.refresh();

    // Écouter les achats validés
    ['amaliessentielv2', 'amalielitev2', 'amaliprestigev2', 'amaliprestigefemmev2'].forEach((id) => {
      InAppPurchase2.when(id).approved((purchase: IAPProduct) => {
        purchase.finish();
      });
    });
  });
}