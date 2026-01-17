import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Store, Mail, Phone, MapPin, Globe } from 'lucide-react';

const StoreSettings = () => {
    const [settings, setSettings] = useState({
        storeName: 'Everyday Essentials Hub',
        storeEmail: 'info@everydayessentials.lk',
        storePhone: '+94 77 123 4567',
        storeAddress: '123 Main Street, Colombo 03, Sri Lanka',
        storeDescription: 'Your trusted online store for quality products at the best prices. Fast delivery across Sri Lanka.',
        freeShippingThreshold: '5000',
        shippingFee: '350',
        taxRate: '0',
        currency: 'LKR',
    });

    const handleInputChange = (field: string, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // In a real application, this would save to a database
        toast.success('Store settings updated successfully');
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Store className="h-5 w-5" />
                        Store Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="storeName">Store Name</Label>
                            <Input
                                id="storeName"
                                value={settings.storeName}
                                onChange={(e) => handleInputChange('storeName', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Input
                                id="currency"
                                value={settings.currency}
                                onChange={(e) => handleInputChange('currency', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="storeDescription">Store Description</Label>
                        <Textarea
                            id="storeDescription"
                            value={settings.storeDescription}
                            onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Contact Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="storeEmail">Email Address</Label>
                            <Input
                                id="storeEmail"
                                type="email"
                                value={settings.storeEmail}
                                onChange={(e) => handleInputChange('storeEmail', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="storePhone">Phone Number</Label>
                            <Input
                                id="storePhone"
                                type="tel"
                                value={settings.storePhone}
                                onChange={(e) => handleInputChange('storePhone', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="storeAddress">Store Address</Label>
                        <Textarea
                            id="storeAddress"
                            value={settings.storeAddress}
                            onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                            rows={2}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Shipping & Pricing
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="shippingFee">Standard Shipping Fee (Rs.)</Label>
                            <Input
                                id="shippingFee"
                                type="number"
                                value={settings.shippingFee}
                                onChange={(e) => handleInputChange('shippingFee', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (Rs.)</Label>
                            <Input
                                id="freeShippingThreshold"
                                type="number"
                                value={settings.freeShippingThreshold}
                                onChange={(e) => handleInputChange('freeShippingThreshold', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="taxRate">Tax Rate (%)</Label>
                            <Input
                                id="taxRate"
                                type="number"
                                step="0.01"
                                value={settings.taxRate}
                                onChange={(e) => handleInputChange('taxRate', e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Order Status Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                                <p className="font-medium">Pending Orders</p>
                                <p className="text-sm text-muted-foreground">New orders awaiting confirmation</p>
                            </div>
                            <div className="px-3 py-1 bg-yellow-500/10 text-yellow-700 rounded-full text-sm font-medium">
                                Active
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                                <p className="font-medium">Processing Orders</p>
                                <p className="text-sm text-muted-foreground">Orders being prepared for shipment</p>
                            </div>
                            <div className="px-3 py-1 bg-blue-500/10 text-blue-700 rounded-full text-sm font-medium">
                                Active
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                                <p className="font-medium">Shipped Orders</p>
                                <p className="text-sm text-muted-foreground">Orders in transit to customers</p>
                            </div>
                            <div className="px-3 py-1 bg-purple-500/10 text-purple-700 rounded-full text-sm font-medium">
                                Active
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                                <p className="font-medium">Delivered Orders</p>
                                <p className="text-sm text-muted-foreground">Successfully completed orders</p>
                            </div>
                            <div className="px-3 py-1 bg-green-500/10 text-green-700 rounded-full text-sm font-medium">
                                Active
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} className="gradient-primary">
                    Save Settings
                </Button>
            </div>
        </div>
    );
};

export default StoreSettings;
