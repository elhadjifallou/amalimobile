import { InAppPurchase2, IAPProduct } from '@awesome-cordova-plugins/in-app-purchase-2';

export function initIAP() {
  document.addEventListener('deviceready', () => {
    console.log("Device ready → Initialisation IAP...");

    InAppPurchase2.verbosity = InAppPurchase2.DEBUG;

    // Enregistrer tes produits
    InAppPurchase2.register([
      { id: 'essentiel', type: InAppPurchase2.PAID_SUBSCRIPTION },
      { id: 'elite', type: InAppPurchase2.PAID_SUBSCRIPTION },
      { id: 'prestige', type: InAppPurchase2.PAID_SUBSCRIPTION },
      { id: 'prestige-femme', type: InAppPurchase2.PAID_SUBSCRIPTION },
    ]);

    InAppPurchase2.refresh();

    // Écouter les achats validés avec type
    ['essentiel', 'elite', 'prestige', 'prestige-femme'].forEach((id) => {
      InAppPurchase2.when(id).approved((purchase: IAPProduct) => {
        console.log(`Achat validé : ${id}`);
        purchase.finish();
      });
    });

    console.log("IAP initialisé !");
  });
}
