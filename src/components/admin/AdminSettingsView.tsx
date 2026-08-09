import React, { useState, useEffect } from 'react';
import { Settings, Store, CreditCard, Truck, MessageSquare, ShieldCheck, Users, Save, CheckCircle2, RefreshCw, Key, HelpCircle } from 'lucide-react';

interface AdminSettingsViewProps {
  currentRole: string;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ currentRole }) => {
  const [activeTab, setActiveTab] = useState<
    'general' | 'store' | 'shipping' | 'payment' | 'courier' | 'whatsapp' | 'invoice' | 'users'
  >('general');

  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const canEditSettings = ['Store Owner', 'Admin'].includes(currentRole);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditSettings) {
      alert(`Role "${currentRole}" does not have permission to modify system settings.`);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          adminName: 'Admin',
          adminRole: currentRole
        })
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="p-8 text-center text-amber-300">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
        <span>Loading Admin Store Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/80 p-4 rounded-xl border border-amber-800/30">
        <div>
          <h3 className="font-serif font-bold text-amber-100 text-base flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <span>Store Configuration & Admin Settings</span>
          </h3>
          <p className="text-xs text-zinc-400">Configure business addresses, courier API credentials, WhatsApp automation templates & user access controls</p>
        </div>

        {canEditSettings && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-all shadow-md shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        )}
      </div>

      {savedSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 p-3 rounded-xl flex items-center gap-2 font-bold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>All store configuration settings saved successfully!</span>
        </div>
      )}

      {/* Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
        {[
          { id: 'general', label: 'General Store Info', icon: Store },
          { id: 'store', label: 'Tax & NTN Reg', icon: ShieldCheck },
          { id: 'shipping', label: 'Shipping Rates', icon: Truck },
          { id: 'payment', label: 'Payment Methods', icon: CreditCard },
          { id: 'courier', label: 'Courier API Keys', icon: Key },
          { id: 'whatsapp', label: 'WhatsApp Automations', icon: MessageSquare },
          { id: 'invoice', label: 'Print Invoices', icon: HelpCircle },
          { id: 'users', label: 'Admin Roles & Users', icon: Users }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === t.id
                  ? 'bg-amber-500 text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-amber-200 hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="bg-zinc-950/80 p-5 rounded-2xl border border-amber-800/30 space-y-4">
        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="space-y-3 max-w-xl">
            <h4 className="font-serif font-bold text-amber-300 text-sm">General Brand Settings</h4>

            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Store Brand Name</label>
              <input
                type="text"
                value={settings.general.storeName}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, storeName: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-amber-100"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Tagline / Brand Slogan</label>
              <input
                type="text"
                value={settings.general.tagline}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, tagline: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-amber-100"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Support Email</label>
              <input
                type="email"
                value={settings.general.contactEmail}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, contactEmail: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-amber-100"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Helpline Phone Number</label>
              <input
                type="text"
                value={settings.general.helplinePhone}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, helplinePhone: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-amber-100"
              />
            </div>
          </div>
        )}

        {/* STORE TAX TAB */}
        {activeTab === 'store' && (
          <div className="space-y-3 max-w-xl">
            <h4 className="font-serif font-bold text-amber-300 text-sm">Workshop Address & Tax Registration</h4>

            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Workshop / Warehouse Address</label>
              <input
                type="text"
                value={settings.storeInformation.workshopAddress}
                onChange={(e) => setSettings({ ...settings, storeInformation: { ...settings.storeInformation, workshopAddress: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-amber-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">City</label>
                <input
                  type="text"
                  value={settings.storeInformation.city}
                  onChange={(e) => setSettings({ ...settings, storeInformation: { ...settings.storeInformation, city: e.target.value } })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-amber-100"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">FBR NTN Number</label>
                <input
                  type="text"
                  value={settings.storeInformation.ntnNumber}
                  onChange={(e) => setSettings({ ...settings, storeInformation: { ...settings.storeInformation, ntnNumber: e.target.value } })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-amber-100 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* SHIPPING TAB */}
        {activeTab === 'shipping' && (
          <div className="space-y-3 max-w-xl">
            <h4 className="font-serif font-bold text-amber-300 text-sm">Delivery & Shipping Rates</h4>

            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Standard Delivery Fee (PKR)</label>
              <input
                type="number"
                value={settings.shipping.standardShippingFee}
                onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, standardShippingFee: Number(e.target.value) } })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-amber-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Free Shipping Threshold (PKR)</label>
              <input
                type="number"
                value={settings.shipping.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, freeShippingThreshold: Number(e.target.value) } })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-amber-100 font-mono"
              />
            </div>
          </div>
        )}

        {/* PAYMENT METHODS */}
        {activeTab === 'payment' && (
          <div className="space-y-3 max-w-xl">
            <h4 className="font-serif font-bold text-amber-300 text-sm">Payment Methods & Bank Details</h4>

            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Bank Name</label>
              <input
                type="text"
                value={settings.paymentMethods.bankName}
                onChange={(e) => setSettings({ ...settings, paymentMethods: { ...settings.paymentMethods, bankName: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-amber-100"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Bank IBAN Number</label>
              <input
                type="text"
                value={settings.paymentMethods.accountIban}
                onChange={(e) => setSettings({ ...settings, paymentMethods: { ...settings.paymentMethods, accountIban: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-amber-100 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">JazzCash Account</label>
                <input
                  type="text"
                  value={settings.paymentMethods.jazzCashNumber}
                  onChange={(e) => setSettings({ ...settings, paymentMethods: { ...settings.paymentMethods, jazzCashNumber: e.target.value } })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-amber-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">EasyPaisa Account</label>
                <input
                  type="text"
                  value={settings.paymentMethods.easyPaisaNumber}
                  onChange={(e) => setSettings({ ...settings, paymentMethods: { ...settings.paymentMethods, easyPaisaNumber: e.target.value } })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-amber-100 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* COURIER API KEYS */}
        {activeTab === 'courier' && (
          <div className="space-y-3 max-w-xl">
            <h4 className="font-serif font-bold text-amber-300 text-sm">Courier Portal API Key Integrations</h4>

            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">TCS Express API Key</label>
              <input
                type="password"
                value={settings.courier.tcsApiKey}
                onChange={(e) => setSettings({ ...settings, courier: { ...settings.courier, tcsApiKey: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-amber-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">PostEx Courier API Key</label>
              <input
                type="password"
                value={settings.courier.postExApiKey}
                onChange={(e) => setSettings({ ...settings, courier: { ...settings.courier, postExApiKey: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-amber-100 font-mono"
              />
            </div>
          </div>
        )}

        {/* WHATSAPP AUTOMATION */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-3 max-w-xl">
            <h4 className="font-serif font-bold text-amber-300 text-sm">Automated WhatsApp Messaging Templates</h4>

            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Order Confirmation WhatsApp Template</label>
              <textarea
                rows={3}
                value={settings.whatsApp.orderConfirmationTemplate}
                onChange={(e) => setSettings({ ...settings, whatsApp: { ...settings.whatsApp, orderConfirmationTemplate: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-amber-100 font-sans"
              />
            </div>
          </div>
        )}

        {/* INVOICE & GUARANTEE */}
        {activeTab === 'invoice' && (
          <div className="space-y-3 max-w-xl">
            <h4 className="font-serif font-bold text-amber-300 text-sm">Invoice Branding & Warranty Guarantee</h4>

            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Invoice Footer Warranty Text</label>
              <input
                type="text"
                value={settings.invoice.footerGuarantee}
                onChange={(e) => setSettings({ ...settings, invoice: { ...settings.invoice, footerGuarantee: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-amber-100"
              />
            </div>
          </div>
        )}

        {/* ADMIN USERS */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-amber-300 text-sm">Authorized Admin Accounts & Role Access</h4>

            <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900">
              {settings.adminUsers?.map((u: any) => (
                <div key={u.id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-amber-100">{u.name} ({u.email})</div>
                    <div className="text-[10px] text-amber-400 font-semibold">{u.role}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    {u.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
