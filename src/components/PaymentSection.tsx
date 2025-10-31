import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  CreditCard, 
  QrCode, 
  Building2, 
  CheckCircle,
  AlertCircle,
  Info,
  Upload,
  X,
  User
} from 'lucide-react'
import { API_BASE_URL } from '@/lib/config'

/**
 * PaymentSection Component
 * 
 * This component handles payment submission and entity creation for:
 * - Shops
 * - Institutes (Education)
 * - Hospitals
 * - Marketplace Products
 * 
 * Image Handling:
 * - Converts blob URLs from image cropper to File objects
 * - Uploads images to Cloudinary via /api/upload/image endpoint
 * - Falls back to placeholder images if upload fails
 * - Sends Cloudinary URLs to backend for entity creation
 * 
 * Flow:
 * 1. User submits payment with screenshot
 * 2. Payment is created and approved
 * 3. Images are uploaded to Cloudinary
 * 4. Entity is created with Cloudinary image URLs
 * 5. Payment is linked to created entity
 */
interface PaymentSectionProps {
  entityType: 'shop' | 'institute' | 'hospital' | 'marketplace'
  onPaymentComplete?: (paymentData: any) => void
  isRequired?: boolean
  isSubmitting?: boolean
  shopData?: any
}

interface PaymentData {
  transactionScreenshot: File | null
  agentId: string
}

export default function PaymentSection({ 
  entityType, 
  onPaymentComplete, 
  isRequired = true,
  isSubmitting: externalIsSubmitting = false,
  shopData
}: PaymentSectionProps) {
  const { toast } = useToast()
  const [paymentData, setPaymentData] = useState<PaymentData>({
    transactionScreenshot: null,
    agentId: ''
  })
  const [loading, setLoading] = useState(true)
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  
  // Use internal state if external state is not provided
  const isSubmitting = externalIsSubmitting || internalIsSubmitting
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountTitle: '',
    accountNumber: '',
    iban: '',
    branchCode: '',
    swiftCode: '',
    qrCodeImage: '',
    paymentAmounts: {
      shop: 5000,
      institute: 10000,
      hospital: 15000,
      marketplace: 2000
    }
  })

  // Fetch payment settings on component mount
  useEffect(() => {
    fetchPaymentSettings()
  }, [])

  const fetchPaymentSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/settings`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setBankDetails(data.settings)
      } else {
        console.error('Failed to fetch payment settings')
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (file: File | null) => {
    setPaymentData(prev => ({ ...prev, transactionScreenshot: file }))
  }

  const handleAgentIdChange = (value: string) => {
    setPaymentData(prev => ({ ...prev, agentId: value }))
  }

  // Function to upload image to Cloudinary with timeout and retry
  const uploadImageToCloudinary = async (file: File, timeoutMs: number = 30000): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const result = await response.json();
        return result.imageUrl;
      } else {
        console.error('Failed to upload image to Cloudinary:', response.status);
        throw new Error('Failed to upload image to Cloudinary');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Image upload timed out:', error);
        throw new Error('Image upload timed out');
      }
      console.error('Error uploading image to Cloudinary:', error);
      throw error;
    }
  }

  // Function to safely upload image with fallback and retry logic
  const safeImageUpload = async (file: File | null, fallbackUrl: string, retries: number = 2): Promise<string> => {
    if (!file) return fallbackUrl;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const url = await uploadImageToCloudinary(file);
        if (url) return url;
        
        if (attempt < retries) {
          console.log(`Image upload attempt ${attempt + 1} failed, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))); // Exponential backoff
        }
      } catch (error) {
        console.error(`Safe image upload attempt ${attempt + 1} failed:`, error);
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }
    
    console.warn('⚠️ Using fallback image due to upload failure');
    return fallbackUrl;
  }

  // Batch upload multiple images in parallel
  const batchUploadImages = async (files: File[], fallbackUrl: string = '') => {
    const uploadPromises = files.map(file => safeImageUpload(file, fallbackUrl));
    const results = await Promise.allSettled(uploadPromises);
    
    return results.map((result, index) => ({
      index,
      url: result.status === 'fulfilled' ? result.value : fallbackUrl,
      success: result.status === 'fulfilled' && !!result.value
    }));
  }

  // Function to convert blob URL to File object
  const convertBlobUrlToFile = async (blobUrl: string): Promise<File | null> => {
    try {
      if (blobUrl.startsWith('blob:')) {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        
        // Create a File object from the blob
        const file = new File([blob], `image-${Date.now()}.jpg`, { type: blob.type });
        return file;
      }
      return null; // Not a blob URL
    } catch (error) {
      console.error('❌ Error converting blob URL to File:', error);
      return null;
    }
  }

  const handleSubmitPayment = async () => {
    // Validation
    if (!paymentData.transactionScreenshot) {
      toast({ 
        title: 'Screenshot Required', 
        description: 'Please upload a screenshot of your transaction', 
        variant: 'destructive' 
      })
      return
    }

    // Agent ID is optional - no validation needed

    // Set internal submitting state to true to show loader
    setInternalIsSubmitting(true)
    setUploadProgress(0)
    setCurrentStep('Submitting payment...')

    // Submit payment directly without creating entity
    try {
      const paymentAmount = getPaymentAmount();
      console.log('💰 Frontend payment data:', {
        entityType,
        agentId: paymentData.agentId.trim() || '',
        amount: paymentAmount,
        amountType: typeof paymentAmount,
        screenshotFile: paymentData.transactionScreenshot?.name
      });

      const paymentFormData = new FormData();
      paymentFormData.append('entityType', entityType);
      paymentFormData.append('agentId', paymentData.agentId.trim() || '');
      paymentFormData.append('transactionScreenshot', paymentData.transactionScreenshot);
      paymentFormData.append('amount', paymentAmount.toString());

      console.log('📤 Sending payment request to:', `${API_BASE_URL}/api/payment/create`);

      const response = await fetch(`${API_BASE_URL}/api/payment/create`, {
        method: 'POST',
        credentials: 'include',
        body: paymentFormData
      });

      if (!response.ok) {
        let errorMessage = 'Failed to submit payment';
        try {
        const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
          console.error('❌ Backend error response:', errorData);
        } catch (parseError) {
          console.error('❌ Could not parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      // Get payment response data
      const paymentResponse = await response.json();
      console.log('💰 Payment response received:', paymentResponse);
      
      const transactionId = paymentResponse.paymentRequest?.transactionId || paymentResponse.transactionId;
      console.log('🆔 Transaction ID extracted:', transactionId);

      setUploadProgress(20)
      setCurrentStep('Processing images...')

      // After successful payment, create the entity with pending approval status
      let createdEntity: any = null
      try {
        console.log(`🏗️ Creating ${entityType} after successful payment...`);
        console.log('📦 Entity data received:', shopData);
        console.log('🔍 Entity data type:', typeof shopData);
        console.log('🔍 Entity data keys:', Object.keys(shopData || {}));
        console.log('📦 Original products data:', shopData?.products);
        console.log('📦 Number of original products:', shopData?.products?.length || 0);

        let entityCreationData = {};
        let entityEndpoint = '';
        let entityName = '';

        switch (entityType) {
          case 'shop':
            entityName = 'Shop';
            entityEndpoint = '/api/shop-wizard/create-from-wizard';
            
            setCurrentStep('Uploading shop images...')
            setUploadProgress(30)
            
            // Convert blob URLs to Cloudinary URLs for shop images
            let shopLogoUrl = '';
            let shopBannerUrl = '';
            let ownerProfileUrl = '';
            
            try {
              if (shopData?.logoPreview) {
                if (shopData.logoPreview.startsWith('blob:')) {
                  const logoFile = await convertBlobUrlToFile(shopData.logoPreview);
                  shopLogoUrl = await safeImageUpload(logoFile, '', 1);
                } else if (shopData.logoPreview.startsWith('https://res.cloudinary.com')) {
                  shopLogoUrl = shopData.logoPreview;
                } else {
                  shopLogoUrl = shopData.logoPreview;
                }
              }
              
              if (shopData?.bannerPreview) {
                if (shopData.bannerPreview.startsWith('blob:')) {
                  const bannerFile = await convertBlobUrlToFile(shopData.bannerPreview);
                  shopBannerUrl = await safeImageUpload(bannerFile, '', 1);
                } else if (shopData.bannerPreview.startsWith('https://res.cloudinary.com')) {
                  shopBannerUrl = shopData.bannerPreview;
                } else {
                  shopBannerUrl = shopData.bannerPreview;
                }
              }
              
              if (shopData?.ownerProfilePreview) {
                if (shopData.ownerProfilePreview.startsWith('blob:')) {
                  const profileFile = await convertBlobUrlToFile(shopData.ownerProfilePreview);
                  ownerProfileUrl = await safeImageUpload(profileFile, '', 1);
                } else if (shopData.ownerProfilePreview.startsWith('https://res.cloudinary.com')) {
                  ownerProfileUrl = shopData.ownerProfilePreview;
                } else {
                  ownerProfileUrl = shopData.ownerProfilePreview;
                }
              }
            } catch (error) {
              console.error('Error processing shop images:', error);
            }
            
            setCurrentStep('Processing product images...')
            setUploadProgress(50)
            const processedProducts = shopData?.products ? await Promise.all(shopData.products.map(async (product: any) => {
              console.log(`📦 Processing product "${product.name}":`, {
                hasImagePreviews: !!product.imagePreviews,
                imagePreviewsLength: product.imagePreviews?.length || 0,
                firstImagePreview: product.imagePreviews?.[0] || 'N/A',
                hasImage: !!product.image,
                image: product.image || 'N/A'
              });
              
              let productImage = ''; // No default placeholder
              
              // If product has imagePreviews array, process the first one
              if (product.imagePreviews && Array.isArray(product.imagePreviews) && product.imagePreviews.length > 0) {
                const firstImagePreview = product.imagePreviews[0];
                console.log(`📦 Product "${product.name}" first image preview:`, firstImagePreview);
                
                if (firstImagePreview.startsWith('blob:')) {
                  try {
                    const imageFile = await convertBlobUrlToFile(firstImagePreview);
                    productImage = await safeImageUpload(imageFile, '', 1); // Reduced retries for products
                    console.log(`📦 Product "${product.name}" image uploaded to Cloudinary:`, productImage);
                  } catch (error) {
                    console.error(`📦 Error uploading product "${product.name}" image:`, error);
                  }
                } else if (firstImagePreview.startsWith('https://res.cloudinary.com')) {
                  // Already a Cloudinary URL
                  productImage = firstImagePreview;
                  console.log(`📦 Product "${product.name}" already has Cloudinary URL:`, productImage);
                } else if (firstImagePreview.startsWith('http')) {
                  // Some other URL
                  productImage = firstImagePreview;
                  console.log(`📦 Product "${product.name}" using existing URL:`, productImage);
                } else {
                  console.log(`📦 Product "${product.name}" invalid image preview format:`, firstImagePreview);
                }
              }
              // If product has single imagePreview, process it
              else if (product.imagePreview && product.imagePreview.startsWith('blob:')) {
                try {
                  const imageFile = await convertBlobUrlToFile(product.imagePreview);
                  productImage = await safeImageUpload(imageFile, '', 1); // Reduced retries for products
                  console.log(`📦 Product "${product.name}" image uploaded to Cloudinary:`, productImage);
                } catch (error) {
                  console.error(`📦 Error uploading product "${product.name}" image:`, error);
                }
              }
              // If product has existing image field that's a Cloudinary URL
              else if (product.image && product.image.startsWith('https://res.cloudinary.com')) {
                productImage = product.image;
                console.log(`📦 Product "${product.name}" using existing Cloudinary image:`, productImage);
              }
              
              console.log(`📦 Product "${product.name}" final image:`, productImage);
              
              return {
                ...product,
                image: productImage
              };
            })) : [];
            
            console.log('📦 Final processed products:', processedProducts);
            console.log('📦 Number of processed products:', processedProducts.length);
            
            entityCreationData = {
              shopName: shopData?.shopName || 'My Shop',
              city: shopData?.city || 'Unknown City',
              shopType: shopData?.shopType || 'General',
              shopDescription: shopData?.shopDescription || 'Shop description',
              address: shopData?.address || '',
              categories: shopData?.categories || [],
              shopLogo: shopLogoUrl,
              shopBanner: shopBannerUrl,
              ownerProfilePhoto: ownerProfileUrl,
              facebookUrl: shopData?.facebookUrl || '',
              instagramHandle: shopData?.instagramHandle || '',
              whatsappNumber: shopData?.whatsappNumber || '',
              websiteUrl: shopData?.websiteUrl || '',
              products: processedProducts,
              agentId: paymentData.agentId.trim() || '',
              approvalStatus: 'pending'
            };
            break;

          case 'institute':
            entityName = 'Institute';
            entityEndpoint = '/api/institute-wizard/create-from-wizard';
            
            setCurrentStep('Uploading institute images...')
            setUploadProgress(40)
            
            // Convert blob URLs to base64 if needed
            let logoUrl = '';
            let bannerUrl = '';
            let galleryUrls = [];
            
            try {
              if (shopData?.logoPreview) {
                const logoFile = await convertBlobUrlToFile(shopData.logoPreview);
                logoUrl = await safeImageUpload(logoFile, '', 1);
                console.log('🎓 Logo processed:', logoUrl.startsWith('https://res.cloudinary.com') ? 'Cloudinary URL' : 'Fallback URL');
              }
              if (shopData?.bannerPreview) {
                const bannerFile = await convertBlobUrlToFile(shopData.bannerPreview);
                bannerUrl = await safeImageUpload(bannerFile, '', 1);
                console.log('🎓 Banner processed:', bannerUrl.startsWith('https://res.cloudinary.com') ? 'Cloudinary URL' : 'Fallback URL');
              }
              
              // Handle gallery images in parallel
              if (shopData?.galleryPreviews && Array.isArray(shopData.galleryPreviews)) {
                const galleryFiles = [];
                for (const galleryPreview of shopData.galleryPreviews) {
                  if (galleryPreview.startsWith('blob:')) {
                    const galleryFile = await convertBlobUrlToFile(galleryPreview);
                    if (galleryFile) galleryFiles.push(galleryFile);
                  }
                }
                
                if (galleryFiles.length > 0) {
                  const uploadResults = await batchUploadImages(galleryFiles);
                  galleryUrls = uploadResults.map(result => result.url).filter(url => url);
                  console.log('🎓 Gallery images processed in parallel:', galleryUrls.length, 'successful uploads');
                }
              }
            } catch (error) {
              console.error('🎓 Error processing images:', error);
              // Keep fallback URLs if processing fails
            }
            
            entityCreationData = {
              name: shopData?.name || shopData?.instituteName || 'Unknown Institute',
              type: shopData?.type || shopData?.instituteType || 'University',
              city: shopData?.city || 'Unknown City',
              province: shopData?.province || 'Punjab',
              description: shopData?.description || shopData?.instituteDescription || 'Institute description',
              specialization: shopData?.specialization || '',
              phone: shopData?.phone || '',
              email: shopData?.email || '',
              website: shopData?.website || '',
              address: shopData?.address || '',
              facebook: shopData?.facebook || '',
              instagram: shopData?.instagram || '',
              twitter: shopData?.twitter || '',
              linkedin: shopData?.linkedin || '',
              courses: shopData?.courses || [],
              faculty: shopData?.faculty || [],
              totalStudents: shopData?.totalStudents || '0',
              totalCourses: shopData?.totalCourses || '0',
              admissionStatus: shopData?.admissionStatus || 'Open',
              establishedYear: shopData?.establishedYear || null,
              accreditation: shopData?.accreditation || [],
              facilities: shopData?.facilities || [],
              domain: shopData?.domain || 'education',
              logo: logoUrl,
              banner: bannerUrl,
              gallery: galleryUrls,
              agentId: paymentData.agentId.trim() || '',
              approvalStatus: 'pending'
            };
            console.log('🎓 Final institute creation data:', entityCreationData);
            break;

          case 'hospital':
            entityName = 'Hospital';
            entityEndpoint = '/api/hospital-wizard/create-from-wizard';
            
            setCurrentStep('Uploading hospital images...')
            setUploadProgress(40)
            
            // Convert blob URLs to Cloudinary URLs for hospital images
            let hospitalLogoUrl = '';
            let hospitalBannerUrl = '';
            let hospitalGalleryUrls = [];
            
            try {
              if (shopData?.logoPreview) {
                const logoFile = await convertBlobUrlToFile(shopData.logoPreview);
                hospitalLogoUrl = await safeImageUpload(logoFile, '', 1);
                console.log('🏥 Hospital logo processed:', hospitalLogoUrl.startsWith('https://res.cloudinary.com') ? 'Cloudinary URL' : 'Fallback URL');
              }
              if (shopData?.bannerPreview) {
                const bannerFile = await convertBlobUrlToFile(shopData.bannerPreview);
                hospitalBannerUrl = await safeImageUpload(bannerFile, '', 1);
                console.log('🏥 Hospital banner processed:', hospitalBannerUrl.startsWith('https://res.cloudinary.com') ? 'Cloudinary URL' : 'Fallback URL');
              }
              if (shopData?.galleryPreviews && Array.isArray(shopData.galleryPreviews)) {
                const galleryFiles = [];
                for (const galleryPreview of shopData.galleryPreviews) {
                  if (galleryPreview.startsWith('blob:')) {
                    const galleryFile = await convertBlobUrlToFile(galleryPreview);
                    if (galleryFile) galleryFiles.push(galleryFile);
                  }
                }
                
                if (galleryFiles.length > 0) {
                  const uploadResults = await batchUploadImages(galleryFiles);
                  hospitalGalleryUrls = uploadResults.map(result => result.url).filter(url => url);
                  console.log('🏥 Hospital gallery images processed in parallel:', hospitalGalleryUrls.length, 'successful uploads');
                }
              }
            } catch (error) {
              console.error('🏥 Error processing hospital images:', error);
            }
            
            // Ensure departments are in the correct shape for backend schema
            const rawDepartments = Array.isArray(shopData.departments) ? shopData.departments : []
            const mappedDepartments = rawDepartments.map((d: any) => {
              if (typeof d === 'string') { return { name: d } }
              if (d && typeof d.name === 'string') { return d }
              return { name: String(d || '') }
            }).filter((d: any) => d.name && d.name.trim() !== '')

            entityCreationData = {
              name: shopData.name || shopData.hospitalName,
              type: shopData.type || shopData.hospitalType,
              city: shopData.city,
              province: shopData.province || 'Punjab',
              description: shopData.description || shopData.hospitalDescription,
              specialization: shopData.specialization,
              phone: shopData.phone,
              email: shopData.email,
              website: shopData.website,
              address: shopData.address,
              emergencyContact: shopData.emergencyContact,
              facebook: shopData.facebook,
              instagram: shopData.instagram,
              twitter: shopData.twitter,
              linkedin: shopData.linkedin,
              departments: mappedDepartments,
              doctors: shopData.doctors || [],
              totalPatients: shopData.totalPatients,
              totalDoctors: shopData.totalDoctors,
              admissionStatus: shopData.admissionStatus || 'Open',
              establishedYear: shopData.establishedYear,
              accreditation: shopData.accreditation || [],
              facilities: shopData.facilities || [],
              insuranceAccepted: shopData.insuranceAccepted || [],
              emergencyServices: shopData.emergencyServices,
              ambulanceService: shopData.ambulanceService,
              logo: hospitalLogoUrl,
              banner: hospitalBannerUrl,
              gallery: hospitalGalleryUrls,
              agentId: paymentData.agentId.trim() || '',
              approvalStatus: 'pending'
            };
            break;

          case 'marketplace':
            entityName = 'Product';
            entityEndpoint = '/api/product-wizard/create-from-wizard';
            
            setCurrentStep('Uploading product images...')
            setUploadProgress(40)
            
            // Convert blob URLs to Cloudinary URLs for product images
            let productImages = [];
            
            try {
              if (shopData?.imagePreviews && Array.isArray(shopData.imagePreviews)) {
                const imageFiles = [];
                for (const imagePreview of shopData.imagePreviews) {
                  if (imagePreview.startsWith('blob:')) {
                    const imageFile = await convertBlobUrlToFile(imagePreview);
                    if (imageFile) imageFiles.push(imageFile);
                  }
                }
                
                if (imageFiles.length > 0) {
                  const uploadResults = await batchUploadImages(imageFiles);
                  productImages = uploadResults.map(result => result.url).filter(url => url);
                  console.log('🛍️ Product images processed in parallel:', productImages.length, 'successful uploads');
                }
              }
            } catch (error) {
              console.error('🛍️ Error processing product images:', error);
            }
            
            entityCreationData = {
              title: shopData.title || shopData.productTitle,
              description: shopData.description || shopData.productDescription,
              price: shopData.price || shopData.productPrice,
              priceType: shopData.priceType || 'fixed',
              category: shopData.category || shopData.productCategory,
              condition: shopData.condition || 'used',
              location: shopData.location,
              city: shopData.city,
              images: productImages,
              tags: shopData.tags || [],
              specifications: shopData.specifications || {},
              contactPreference: shopData.contactPreference || 'both',
              agentId: paymentData.agentId.trim() || '',
              approvalStatus: 'pending'
            };
            break;

          default:
            console.warn('⚠️ Unknown entity type:', entityType);
            break;
        }

        if (entityCreationData && entityEndpoint) {
          console.log(`📝 ${entityName} creation data:`, entityCreationData);
          console.log(`🌐 Making API call to: ${API_BASE_URL}${entityEndpoint}`);

          setCurrentStep(`Creating ${entityName.toLowerCase()}...`)
          setUploadProgress(70)

          const entityResponse = await fetch(`${API_BASE_URL}${entityEndpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(entityCreationData)
          });

          console.log(`📡 ${entityName} creation response status:`, entityResponse.status);
          console.log(`📡 ${entityName} creation response headers:`, entityResponse.headers);

          if (entityResponse.ok) {
            const entityResult = await entityResponse.json();
            createdEntity = entityResult[entityName.toLowerCase()] || entityResult.entity || entityResult
            console.log(`✅ ${entityName} created successfully:`, entityResult);
            
            setCurrentStep('Linking payment...')
            setUploadProgress(90)
            
            // Link payment request to created entity
            try {
              console.log(`🔗 Linking payment request to created ${entityName.toLowerCase()}...`);
              const updatePaymentResponse = await fetch(`${API_BASE_URL}/api/payment/${transactionId}/link-entity`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  entityId: createdEntity?._id,
                  entityType: entityType
                })
              });
              
              if (updatePaymentResponse.ok) {
                console.log(`✅ Payment request linked to ${entityName.toLowerCase()} successfully`);
              } else {
                console.warn(`⚠️ Failed to link payment request to ${entityName.toLowerCase()}:`, updatePaymentResponse.status);
              }
            } catch (linkError) {
              console.warn(`⚠️ Error linking payment to ${entityName.toLowerCase()}:`, linkError);
            }

            setCurrentStep('Complete!')
            setUploadProgress(100)

            toast({ 
              title: `Payment & ${entityName} Setup Complete!`, 
              description: `Your payment has been submitted and ${entityName.toLowerCase()} has been created. It is now pending admin approval.` 
            });
          } else {
            console.error(`❌ ${entityName} creation failed:`, entityResponse.status);
            
            // Try to get error details from response
            try {
              const errorText = await entityResponse.text();
              console.error(`❌ ${entityName} creation error details:`, errorText);
              
              let errorMessage = `Payment Submitted, ${entityName} Creation Failed`;
              try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || errorData.details || errorMessage;
              } catch (parseError) {
                errorMessage = errorText || errorMessage;
              }
              
              toast({ 
                title: `Payment Submitted, ${entityName} Creation Failed`, 
                description: errorMessage, 
                variant: 'destructive' 
              });
            } catch (errorParseError) {
              console.error(`❌ Could not parse ${entityName} creation error:`, errorParseError);
              toast({ 
                title: `Payment Submitted, ${entityName} Creation Failed`, 
                description: `Payment was submitted but ${entityName.toLowerCase()} creation failed. Please contact support.`, 
                variant: 'destructive' 
              });
            }
          }
        }
      } catch (entityError) {
        console.error(`❌ Error creating ${entityType}:`, entityError);
        toast({ 
          title: `Payment Submitted, ${entityType} Creation Failed`, 
          description: `Payment was submitted but ${entityType} creation failed. Please contact support.`, 
          variant: 'destructive' 
        });
      }

      // Call the callback if provided (for any additional handling)
      if (onPaymentComplete) {
        onPaymentComplete({
          transactionId,
          entityType,
          entity: createdEntity,
          payment: paymentResponse.paymentRequest || paymentResponse
        })
      }

      // Reset form after successful submission
      setPaymentData({
        transactionScreenshot: null,
        agentId: ''
      })

    } catch (error) {
      console.error('Error submitting payment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit payment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      // Reset internal submitting state
      setInternalIsSubmitting(false)
    }
  }

  const getEntityDisplayName = () => {
    switch (entityType) {
      case 'shop': return 'Shop'
      case 'institute': return 'Institute'
      case 'hospital': return 'Hospital'
      case 'marketplace': return 'Marketplace Listing'
      default: return 'Entity'
    }
  }

  const getPaymentAmount = () => {
    return bankDetails.paymentAmounts[entityType] || 5000
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading payment information...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Payment Section</h2>
        </div>
        <p className="text-muted-foreground">
          Complete payment to finalize your {getEntityDisplayName().toLowerCase()} creation
        </p>
        {isRequired && (
          <Badge variant="destructive" className="text-sm">
            Payment Required
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Bank Details & QR Code */}
        <div className="space-y-6">
          {/* Bank Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5" />
                Bank Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="font-medium">Bank Name:</span>
                  <span className="text-muted-foreground">{bankDetails.bankName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="font-medium">Account Title:</span>
                  <span className="text-muted-foreground">{bankDetails.accountTitle}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="font-medium">Account Number:</span>
                  <span className="text-muted-foreground font-mono">{bankDetails.accountNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="font-medium">IBAN:</span>
                  <span className="text-muted-foreground font-mono text-xs">{bankDetails.iban}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="font-medium">Branch Code:</span>
                  <span className="text-muted-foreground">{bankDetails.branchCode}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">SWIFT Code:</span>
                  <span className="text-muted-foreground">{bankDetails.swiftCode}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <QrCode className="h-5 w-5" />
                QR Code for Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {bankDetails.qrCodeImage ? (
                <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
                  <img 
                    src={bankDetails.qrCodeImage} 
                    alt="QR Code for Payment" 
                    className="h-32 w-32 mx-auto object-contain"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Scan to get bank details
                  </p>
                </div>
              ) : (
                <div className="bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
                  <QrCode className="h-32 w-32 mx-auto text-gray-400" />
                  <p className="text-sm text-muted-foreground mt-2">
                    QR Code not configured
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                {bankDetails.qrCodeImage 
                  ? 'Scan the QR code above to get bank details'
                  : 'Admin needs to upload a QR code image in the admin panel'
                }
              </p>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <Info className="h-4 w-4" />
                  <span className="font-medium">Required Amount</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  PKR {getPaymentAmount().toLocaleString()}
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  One-time fee for {getEntityDisplayName().toLowerCase()} creation
                </p>
              </div>
              
                             {/* Agent ID Input */}
               <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                 <div className="flex items-center gap-2 text-green-800 mb-2">
                   <User className="h-4 w-4" />
                   <span className="font-medium">Agent ID</span>
                   <span className="text-gray-500 text-sm">(Optional)</span>
                 </div>
                 <input
                   type="text"
                   value={paymentData.agentId}
                   onChange={(e) => handleAgentIdChange(e.target.value)}
                   placeholder="Enter your Agent ID"
                   className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-green-900 font-mono"
                 />
                 <p className="text-sm text-green-700 mt-1">
                   This Agent ID will be included in your payment request (optional)
                 </p>
               </div>
              
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 text-amber-800 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Important Notes</span>
                </div>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Payment processing takes 24-48 hours</li>
                  <li>• Keep your transaction receipt for verification</li>
                  <li>• Contact support if payment issues arise</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Screenshot Upload Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5" />
              Upload Transaction Screenshot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Please upload a screenshot of your bank transaction showing the payment to our account.
              </p>
              
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                {paymentData.transactionScreenshot ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">File Selected</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {paymentData.transactionScreenshot.name}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileChange(null)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) handleFileChange(file)
                        }
                        input.click()
                      }}
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Indicator */}
            {isSubmitting && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{currentStep}</span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <Button
              type="button"
              onClick={handleSubmitPayment}
              disabled={isSubmitting || !paymentData.transactionScreenshot}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {currentStep || 'Processing...'}
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Payment Request
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By submitting this form, you agree to our payment terms and conditions
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
