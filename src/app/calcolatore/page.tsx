'use client';

import { useState, useEffect } from 'react';

interface PricingConfig {
  hosting: {
    plan: 'basic' | 'pro' | 'enterprise';
    storage: number;
    bandwidth: number;
    domains: number;
  };
  storage: {
    type: 'ssd' | 'nvme' | 'cloud';
    size: number;
    backup: boolean;
  };
  compute: {
    cpu: number;
    ram: number;
    instances: number;
  };
  addons: {
    ssl: boolean;
    cdn: boolean;
    monitoring: boolean;
    support: 'basic' | 'premium' | 'enterprise';
  };
}

const PRICING = {
  hosting: {
    basic: { base: 9.99, storage: 0.05, bandwidth: 0.02, domains: 2 },
    pro: { base: 29.99, storage: 0.03, bandwidth: 0.015, domains: 1 },
    enterprise: { base: 99.99, storage: 0.02, bandwidth: 0.01, domains: 0.5 }
  },
  storage: {
    ssd: 0.08,
    nvme: 0.12,
    cloud: 0.06
  },
  compute: {
    cpu: 15.99,
    ram: 8.99,
    instance: 5.99
  },
  addons: {
    ssl: 4.99,
    cdn: 9.99,
    monitoring: 14.99,
    support: {
      basic: 0,
      premium: 19.99,
      enterprise: 49.99
    }
  }
};

export default function Calcolatore() {
  const [config, setConfig] = useState<PricingConfig>({
    hosting: {
      plan: 'basic',
      storage: 10,
      bandwidth: 100,
      domains: 1
    },
    storage: {
      type: 'ssd',
      size: 50,
      backup: false
    },
    compute: {
      cpu: 2,
      ram: 4,
      instances: 1
    },
    addons: {
      ssl: false,
      cdn: false,
      monitoring: false,
      support: 'basic'
    }
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [breakdown, setBreakdown] = useState<{[key: string]: number}>({});

  useEffect(() => {
    calculatePrice();
  }, [config]);

  const calculatePrice = () => {
    const hostingPlan = PRICING.hosting[config.hosting.plan];
    const hostingCost = hostingPlan.base + 
      (config.hosting.storage * hostingPlan.storage) +
      (config.hosting.bandwidth * hostingPlan.bandwidth) +
      (Math.max(0, config.hosting.domains - 1) * hostingPlan.domains);

    const storageCost = config.storage.size * PRICING.storage[config.storage.type] +
      (config.storage.backup ? config.storage.size * 0.02 : 0);

    const computeCost = 
      (config.compute.cpu * PRICING.compute.cpu) +
      (config.compute.ram * PRICING.compute.ram) +
      (config.compute.instances * PRICING.compute.instance);

    const addonsCost = 
      (config.addons.ssl ? PRICING.addons.ssl : 0) +
      (config.addons.cdn ? PRICING.addons.cdn : 0) +
      (config.addons.monitoring ? PRICING.addons.monitoring : 0) +
      PRICING.addons.support[config.addons.support];

    const newBreakdown = {
      hosting: hostingCost,
      storage: storageCost,
      compute: computeCost,
      addons: addonsCost
    };

    setBreakdown(newBreakdown);
    setTotalPrice(Object.values(newBreakdown).reduce((sum, cost) => sum + cost, 0));
  };

  const updateConfig = (section: keyof PricingConfig, field: string, value: string | number | boolean) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const ConfigSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  const SliderInput = ({ label, value, min, max, step = 1, unit, onChange }: {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit: string;
    onChange: (value: number) => void;
  }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-500">{value} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );

  const SelectInput = ({ label, value, options, onChange }: {
    label: string;
    value: string;
    options: { value: string; label: string; description?: string }[];
    onChange: (value: string) => void;
  }) => (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-700 mb-2 block">{label}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="mr-3"
            />
            <div>
              <div className="font-medium text-gray-900">{option.label}</div>
              {option.description && (
                <div className="text-sm text-gray-500">{option.description}</div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  const CheckboxInput = ({ label, checked, onChange, description }: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
  }) => (
    <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 mb-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mr-3 mt-1"
      />
      <div>
        <div className="font-medium text-gray-900">{label}</div>
        {description && (
          <div className="text-sm text-gray-500">{description}</div>
        )}
      </div>
    </label>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Calcolatore Prezzi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Configura i tuoi servizi cloud e ottieni un preventivo personalizzato in tempo reale
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configurazione */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hosting */}
            <ConfigSection title="🌐 Hosting Web">
              <SelectInput
                label="Piano Hosting"
                value={config.hosting.plan}
                options={[
                  { value: 'basic', label: 'Basic', description: 'Perfetto per siti personali e piccoli progetti' },
                  { value: 'pro', label: 'Professional', description: 'Ideale per aziende e siti ad alto traffico' },
                  { value: 'enterprise', label: 'Enterprise', description: 'Soluzioni su misura per grandi organizzazioni' }
                ]}
                onChange={(value) => updateConfig('hosting', 'plan', value)}
              />
              <SliderInput
                label="Storage"
                value={config.hosting.storage}
                min={1}
                max={1000}
                unit="GB"
                onChange={(value) => updateConfig('hosting', 'storage', value)}
              />
              <SliderInput
                label="Bandwidth Mensile"
                value={config.hosting.bandwidth}
                min={10}
                max={10000}
                step={10}
                unit="GB"
                onChange={(value) => updateConfig('hosting', 'bandwidth', value)}
              />
              <SliderInput
                label="Domini"
                value={config.hosting.domains}
                min={1}
                max={50}
                unit="domini"
                onChange={(value) => updateConfig('hosting', 'domains', value)}
              />
            </ConfigSection>

            {/* Storage */}
            <ConfigSection title="💾 Storage Aggiuntivo">
              <SelectInput
                label="Tipo di Storage"
                value={config.storage.type}
                options={[
                  { value: 'ssd', label: 'SSD Standard', description: 'Velocità elevata per uso generale' },
                  { value: 'nvme', label: 'NVMe Premium', description: 'Massime prestazioni per applicazioni critiche' },
                  { value: 'cloud', label: 'Cloud Storage', description: 'Scalabile e ridondante' }
                ]}
                onChange={(value) => updateConfig('storage', 'type', value)}
              />
              <SliderInput
                label="Dimensione Storage"
                value={config.storage.size}
                min={0}
                max={5000}
                step={10}
                unit="GB"
                onChange={(value) => updateConfig('storage', 'size', value)}
              />
              <CheckboxInput
                label="Backup Automatico"
                checked={config.storage.backup}
                onChange={(checked) => updateConfig('storage', 'backup', checked)}
                description="Backup giornalieri automatici con retention di 30 giorni"
              />
            </ConfigSection>

            {/* Compute */}
            <ConfigSection title="⚡ Risorse Compute">
              <SliderInput
                label="CPU Cores"
                value={config.compute.cpu}
                min={1}
                max={32}
                unit="cores"
                onChange={(value) => updateConfig('compute', 'cpu', value)}
              />
              <SliderInput
                label="RAM"
                value={config.compute.ram}
                min={1}
                max={128}
                unit="GB"
                onChange={(value) => updateConfig('compute', 'ram', value)}
              />
              <SliderInput
                label="Istanze"
                value={config.compute.instances}
                min={1}
                max={10}
                unit="istanze"
                onChange={(value) => updateConfig('compute', 'instances', value)}
              />
            </ConfigSection>

            {/* Add-ons */}
            <ConfigSection title="🔧 Servizi Aggiuntivi">
              <CheckboxInput
                label="Certificato SSL"
                checked={config.addons.ssl}
                onChange={(checked) => updateConfig('addons', 'ssl', checked)}
                description="Certificato SSL/TLS per sicurezza HTTPS"
              />
              <CheckboxInput
                label="CDN Globale"
                checked={config.addons.cdn}
                onChange={(checked) => updateConfig('addons', 'cdn', checked)}
                description="Content Delivery Network per prestazioni globali"
              />
              <CheckboxInput
                label="Monitoraggio Avanzato"
                checked={config.addons.monitoring}
                onChange={(checked) => updateConfig('addons', 'monitoring', checked)}
                description="Monitoraggio 24/7 con alerting e analytics"
              />
              <SelectInput
                label="Supporto Tecnico"
                value={config.addons.support}
                options={[
                  { value: 'basic', label: 'Basic (Gratuito)', description: 'Email support in 24-48h' },
                  { value: 'premium', label: 'Premium', description: 'Chat e telefono in 2-4h' },
                  { value: 'enterprise', label: 'Enterprise', description: 'Supporto dedicato 24/7' }
                ]}
                onChange={(value) => updateConfig('addons', 'support', value)}
              />
            </ConfigSection>
          </div>

          {/* Riepilogo Prezzi */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">💰 Riepilogo Prezzi</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Hosting Web</span>
                  <span className="font-medium">€{breakdown.hosting?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Storage</span>
                  <span className="font-medium">€{breakdown.storage?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Compute</span>
                  <span className="font-medium">€{breakdown.compute?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Servizi Aggiuntivi</span>
                  <span className="font-medium">€{breakdown.addons?.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Totale Mensile</span>
                  <span className="text-2xl font-bold text-blue-600">€{totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">IVA esclusa</p>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Richiedi Preventivo
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Salva Configurazione
                </button>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-green-600 mr-2">🎉</span>
                  <span className="font-medium text-green-800">Offerta Speciale</span>
                </div>
                <p className="text-sm text-green-700">
                  Sconto del 20% sui primi 3 mesi per nuovi clienti!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}