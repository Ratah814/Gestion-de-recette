import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

const InvoiceForm = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    invoiceDate: '',
    deliveryDate: '',
    senderAddress: '',
    recipientAddress: '',
    vatNumber: '',
    amount: '',
    vatRate: '20',
    vatAmount: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'amount' || name === 'vatRate') {
        const amount = parseFloat(newData.amount) || 0;
        const vatRate = parseFloat(newData.vatRate) || 0;
        newData.vatAmount = ((amount * vatRate) / 100).toFixed(2);
      }
      return newData;
    });
  };

  const generatePDF = () => {
    // Création de la structure HTML pour le PDF
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-details { margin-bottom: 20px; }
            .addresses { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .amount-details { margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FACTURE</h1>
            <p>N° ${invoiceData.invoiceNumber}</p>
          </div>
          
          <div class="invoice-details">
            <p>Date de facturation : ${invoiceData.invoiceDate}</p>
            <p>Date de livraison : ${invoiceData.deliveryDate}</p>
          </div>

          <div class="addresses">
            <div>
              <h3>De :</h3>
              <p>${invoiceData.senderAddress.replace(/\n/g, '<br>')}</p>
              <p>N° TVA : ${invoiceData.vatNumber}</p>
            </div>
            <div>
              <h3>À :</h3>
              <p>${invoiceData.recipientAddress.replace(/\n/g, '<br>')}</p>
            </div>
          </div>

          <div>
            <h3>Description :</h3>
            <p>${invoiceData.description.replace(/\n/g, '<br>')}</p>
          </div>

          <div class="amount-details">
            <p>Montant HT : ${invoiceData.amount} €</p>
            <p>TVA (${invoiceData.vatRate}%) : ${invoiceData.vatAmount} €</p>
            <p><strong>Total TTC : ${(parseFloat(invoiceData.amount) + parseFloat(invoiceData.vatAmount || 0)).toFixed(2)} €</strong></p>
          </div>
        </body>
      </html>
    `;

    // Création du Blob et téléchargement
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `facture_${invoiceData.invoiceNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Facture</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Numéro de facture
              </label>
              <input
                type="text"
                name="invoiceNumber"
                value={invoiceData.invoiceNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Date de la facture
              </label>
              <input
                type="date"
                name="invoiceDate"
                value={invoiceData.invoiceDate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

                        <div>
              <label className="block text-sm font-medium mb-1">
                Votre adresse
              </label>
              <textarea
                name="senderAddress"
                value={invoiceData.senderAddress}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Adresse du destinataire
              </label>
              <textarea
                name="recipientAddress"
                value={invoiceData.recipientAddress}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Numéro de TVA
              </label>
              <input
                type="text"
                name="vatNumber"
                value={invoiceData.vatNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Montant HT
                </label>
                <input
                  type="number"
                  name="amount"
                  value={invoiceData.amount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Taux TVA (%)
                </label>
                <input
                  type="number"
                  name="vatRate"
                  value={invoiceData.vatRate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Montant TVA
              </label>
              <input
                type="text"
                value={invoiceData.vatAmount}
                readOnly
                className="w-full p-2 border rounded bg-gray-50"
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Description du produit ou service
            </label>
            <textarea
              name="description"
              value={invoiceData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="4"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <p className="text-lg font-bold">
            Total TTC: {(parseFloat(invoiceData.amount) + parseFloat(invoiceData.vatAmount || 0)).toFixed(2)} €
          </p>
          <Button 
            onClick={generatePDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Générer la facture
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;