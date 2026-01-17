import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Facebook } from 'lucide-react';

const CATEGORIES = [
    'Kitchen Items',
    'Bags',
    'CCTV Cameras',
    'Vacuum Cleaners',
    'Tools',
    'Others'
];

const AddProduct = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [productImages, setProductImages] = useState<string[]>([]);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [uploadingFile, setUploadingFile] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        original_price: '',
        category: '',
        description: '',
        facebook_post_link: '',
        stock_quantity: '0',
        product_status: 'active',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingFile(true);
        const uploadedUrls: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Validate file type
                const isImage = file.type.startsWith('image/');
                const isVideo = file.type.startsWith('video/');

                if (!isImage && !isVideo) {
                    toast.error(`${file.name} is not an image or video file`);
                    continue;
                }

                // Create a data URL for preview
                const reader = new FileReader();
                const dataUrl = await new Promise<string>((resolve) => {
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsDataURL(file);
                });

                uploadedUrls.push(dataUrl);
            }

            if (uploadedUrls.length > 0) {
                setProductImages(prev => [...prev, ...uploadedUrls]);
                toast.success(`${uploadedUrls.length} file(s) uploaded successfully`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload files');
        } finally {
            setUploadingFile(false);
            // Reset file input
            e.target.value = '';
        }
    };

    const handleAddImage = () => {
        if (imagePreview.trim()) {
            setProductImages(prev => [...prev, imagePreview.trim()]);
            setImagePreview('');
            toast.success('Image added to gallery');
        }
    };

    const handleRemoveImage = (index: number) => {
        setProductImages(prev => prev.filter((_, i) => i !== index));
        toast.info('File removed');
    };

    const isVideoUrl = (url: string) => {
        return url.startsWith('data:video/') ||
            url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validation
            if (!formData.name.trim()) {
                toast.error('Product name is required');
                return;
            }

            if (!formData.price || parseFloat(formData.price) <= 0) {
                toast.error('Valid price is required');
                return;
            }

            if (!formData.category) {
                toast.error('Please select a category');
                return;
            }

            // Get category ID
            const { data: categoryData, error: categoryError } = await supabase
                .from('categories')
                .select('id')
                .eq('name', formData.category)
                .single();

            if (categoryError) {
                toast.error('Category not found. Please create the category first.');
                return;
            }

            const slug = generateSlug(formData.name);

            // Prepare product data
            const productData = {
                name: formData.name.trim(),
                slug: slug,
                description: formData.description.trim() || null,
                price: parseFloat(formData.price),
                original_price: formData.original_price ? parseFloat(formData.original_price) : null,
                stock_quantity: parseInt(formData.stock_quantity) || 0,
                category_id: categoryData.id,
                image_url: productImages[0] || null, // First image as main image
                featured: false,
            };

            // Try to insert the product
            // Note: If RLS is blocking, you may need to disable RLS on products table
            const { data: insertedProduct, error } = await supabase
                .from('products')
                .insert([productData])
                .select()
                .single();

            if (error) {
                // If RLS error, provide helpful message
                if (error.message.includes('row-level security')) {
                    toast.error('Permission denied. Please disable RLS on products table or contact admin.');
                    console.error('RLS Error - Run this SQL in Supabase:', 'ALTER TABLE products DISABLE ROW LEVEL SECURITY;');
                } else {
                    toast.error('Failed to add product: ' + error.message);
                }
                throw error;
            }

            // Store additional data in localStorage for now (Facebook link and extra images)
            if (formData.facebook_post_link || productImages.length > 1 || formData.product_status !== 'active') {
                const extraData = {
                    facebook_link: formData.facebook_post_link.trim() || null,
                    gallery_images: productImages,
                    status: formData.product_status,
                };
                localStorage.setItem(`product_extra_${slug}`, JSON.stringify(extraData));
            }

            toast.success('Product added successfully!');
            navigate('/admin/products');
        } catch (error: any) {
            console.error('Error adding product:', error);
            toast.error('Failed to add product: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-4xl">
                <div>
                    <h1 className="text-3xl font-bold">Add New Product</h1>
                    <p className="text-muted-foreground mt-2">
                        Create a new product manually with all details
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Product Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Product Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>

                            {/* Price Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">
                                        Price (Rs.) <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange('price', e.target.value)}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="original_price">Original Price (Rs.)</Label>
                                    <Input
                                        id="original_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.original_price}
                                        onChange={(e) => handleInputChange('original_price', e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Category and Stock */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">
                                        Category <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => handleInputChange('category', value)}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                                    <Input
                                        id="stock_quantity"
                                        type="number"
                                        min="0"
                                        value={formData.stock_quantity}
                                        onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Short Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Enter product description..."
                                    rows={4}
                                />
                            </div>

                            {/* Product Status */}
                            <div className="space-y-2">
                                <Label htmlFor="product_status">Product Status</Label>
                                <Select
                                    value={formData.product_status}
                                    onValueChange={(value) => handleInputChange('product_status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Facebook Post Link */}
                            <div className="space-y-2">
                                <Label htmlFor="facebook_post_link" className="flex items-center gap-2">
                                    <Facebook className="h-4 w-4 text-blue-600" />
                                    Facebook Post Link (Optional)
                                </Label>
                                <Input
                                    id="facebook_post_link"
                                    type="url"
                                    value={formData.facebook_post_link}
                                    onChange={(e) => handleInputChange('facebook_post_link', e.target.value)}
                                    placeholder="https://www.facebook.com/..."
                                />
                                <p className="text-xs text-muted-foreground">
                                    Optional: Add a Facebook post link as external reference. This will NOT automatically fetch data.
                                </p>
                            </div>

                            {/* Product Images & Videos */}
                            <div className="space-y-4">
                                <Label>Product Images & Videos</Label>

                                {/* File Upload */}
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Input
                                                type="file"
                                                accept="image/*,video/*"
                                                multiple
                                                onChange={handleFileUpload}
                                                disabled={uploadingFile}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={uploadingFile}
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            {uploadingFile ? 'Uploading...' : 'Upload Files'}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Upload images or videos from your device. Multiple files supported.
                                    </p>
                                </div>

                                {/* URL Input */}
                                <div className="space-y-2">
                                    <Label className="text-sm">Or add by URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="url"
                                            value={imagePreview}
                                            onChange={(e) => setImagePreview(e.target.value)}
                                            placeholder="Enter image or video URL"
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleAddImage}
                                            disabled={!imagePreview.trim()}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add
                                        </Button>
                                    </div>
                                </div>

                                {/* Media Gallery */}
                                {productImages.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        {productImages.map((media, index) => {
                                            const isVideo = isVideoUrl(media);

                                            return (
                                                <div key={index} className="relative group">
                                                    {isVideo ? (
                                                        <video
                                                            src={media}
                                                            className="w-full h-32 object-cover rounded-lg border"
                                                            controls
                                                        />
                                                    ) : (
                                                        <img
                                                            src={media}
                                                            alt={`Product ${index + 1}`}
                                                            className="w-full h-32 object-cover rounded-lg border"
                                                        />
                                                    )}
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                                        onClick={() => handleRemoveImage(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                    {index === 0 && (
                                                        <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                                            Main
                                                        </span>
                                                    )}
                                                    {isVideo && (
                                                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                                            Video
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {productImages.length === 0 && (
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                                        <Upload className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                        <p className="text-sm text-muted-foreground">
                                            No media files added yet. Upload images or videos above.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    className="gradient-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Adding Product...' : 'Add Product'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/admin/products')}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AddProduct;
