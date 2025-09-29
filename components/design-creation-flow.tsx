"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Plus, 
  Minus, 
  ShoppingCart,
  Palette,
  Shirt,
  Calculator,
  X
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface DesignConfig {
  product: string
  size: string
  color: string
  design: string | null
  quantity: number
  basePrice: number
}

export function DesignCreationFlow() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showSampleModal, setShowSampleModal] = useState(false)
  const [config, setConfig] = useState<DesignConfig>({
    product: "camiseta",
    size: "M",
    color: "blanco",
    design: null,
    quantity: 1,
    basePrice: 24.99
  })

  const steps = [
    { id: 1, title: "Producto", icon: Shirt },
    { id: 2, title: "Diseño", icon: Palette },
    { id: 3, title: "Cantidad", icon: Calculator },
    { id: 4, title: "Resumen", icon: ShoppingCart }
  ]

  const productOptions = [
    { id: "1001", name: "Camiseta Premium", price: 24.99, image: "/products/small.png" },
    { id: "1002", name: "Sudadera", price: 44.99, image: "/products/small.png" },
    { id: "1003", name: "Taza", price: 16.99, image: "/products/small.png" }
  ]

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"]
  const colorOptions = [
    { id: "blanco", name: "Blanco", hex: "#FFFFFF" },
    { id: "negro", name: "Negro", hex: "#000000" },
    { id: "azul", name: "Azul", hex: "#3B82F6" },
    { id: "rojo", name: "Rojo", hex: "#EF4444" }
  ]

  const calculatePrice = () => {
    let price = config.basePrice * config.quantity
    
    // Volume discounts
    if (config.quantity >= 10) price *= 0.9  // 10% discount
    if (config.quantity >= 25) price *= 0.85 // 15% total discount
    if (config.quantity >= 50) price *= 0.8  // 20% total discount
    
    return price.toFixed(2)
  }

  const samplePricing = [
    { quantity: 1, price: 15.99, description: "Una muestra individual" },
    { quantity: 10, price: 12.99, description: "Precio por muestra (mín. 10)" },
    { quantity: 30, price: 9.99, description: "Precio por muestra (mín. 30)" }
  ]

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const goToCustomizer = () => {
    // Redirect to customizer with product configuration
    const params = new URLSearchParams({
      productid: config.product,
      quantity: config.quantity.toString(),
      size: config.size,
      color: config.color
    })
    router.push(`/customizer?${params.toString()}`)
  }

  return (
    <div className="p-6 bg-accent/5 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Crear Nuevo Diseño</h1>
        <p className="text-muted-foreground">Sigue los pasos para crear tu producto personalizado</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step.id ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <span className={`ml-2 font-medium ${
                currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 mx-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">
                Paso {currentStep}: {steps.find(s => s.id === currentStep)?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Step 1: Product Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Selecciona tu producto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {productOptions.map((product) => (
                        <div
                          key={product.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            config.product === product.id ? 'border-secondary bg-secondary/5' : 'border-border hover:border-secondary/50'
                          }`}
                          onClick={() => setConfig({...config, product: product.id, basePrice: product.price})}
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={150}
                            height={150}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-secondary font-semibold">${product.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Talla</h3>
                      <div className="flex flex-wrap gap-2">
                        {sizeOptions.map((size) => (
                          <Button
                            key={size}
                            variant={config.size === size ? "default" : "outline"}
                            className={config.size === size ? "bg-secondary hover:bg-secondary/90" : ""}
                            onClick={() => setConfig({...config, size})}
                          >
                            {size}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Color</h3>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <div
                            key={color.id}
                            className={`w-12 h-12 rounded-full border-2 cursor-pointer flex items-center justify-center ${
                              config.color === color.id ? 'border-secondary' : 'border-border'
                            }`}
                            style={{ backgroundColor: color.hex }}
                            onClick={() => setConfig({...config, color: color.id})}
                            title={color.name}
                          >
                            {config.color === color.id && (
                              <div className={`w-2 h-2 rounded-full ${color.hex === '#FFFFFF' ? 'bg-black' : 'bg-white'}`} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Design Upload */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Sube tu diseño</h3>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">
                        Arrastra y suelta tu diseño aquí, o haz clic para seleccionar
                      </p>
                      <Button variant="outline">
                        Seleccionar Archivo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Formatos soportados: PNG, JPG, SVG (máx. 10MB)
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">O elige un diseño predefinido</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="border rounded-lg p-4 cursor-pointer hover:border-secondary transition-colors"
                          onClick={() => setConfig({...config, design: `preset-${i}`})}
                        >
                          <div className="w-full h-20 bg-muted rounded mb-2 flex items-center justify-center">
                            <Palette className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-center">Diseño {i}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Quantity */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">¿Cuántas unidades necesitas?</h3>
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setConfig({...config, quantity: Math.max(1, config.quantity - 1)})}
                        disabled={config.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <div className="text-center">
                        <div className="text-3xl font-bold">{config.quantity}</div>
                        <div className="text-sm text-muted-foreground">unidades</div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setConfig({...config, quantity: config.quantity + 1})}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[5, 10, 25].map((qty) => (
                      <Button
                        key={qty}
                        variant="outline"
                        className="h-16"
                        onClick={() => setConfig({...config, quantity: qty})}
                      >
                        <div className="text-center">
                          <div className="font-bold">{qty} unidades</div>
                          <div className="text-xs text-muted-foreground">
                            {qty >= 10 && "10% descuento"}
                            {qty >= 25 && "15% descuento"}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>

                  <div className="bg-accent/10 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Descuentos por volumen:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 10-24 unidades: 10% de descuento</li>
                      <li>• 25-49 unidades: 15% de descuento</li>
                      <li>• 50+ unidades: 20% de descuento</li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-secondary text-secondary hover:bg-secondary/10"
                      onClick={() => setShowSampleModal(true)}
                    >
                      📦 Solicitar Muestra
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Recibe una muestra física antes de hacer tu pedido completo
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Summary */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="font-semibold mb-4">Resumen del pedido</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Producto:</span>
                      <span className="font-medium">
                        {productOptions.find(p => p.id === config.product)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Talla:</span>
                      <span className="font-medium">{config.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Color:</span>
                      <span className="font-medium">
                        {colorOptions.find(c => c.id === config.color)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cantidad:</span>
                      <span className="font-medium">{config.quantity} unidades</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Precio base:</span>
                      <span>${(config.basePrice * config.quantity).toFixed(2)}</span>
                    </div>
                    {config.quantity >= 10 && (
                      <div className="flex justify-between text-green-600">
                        <span>Descuento por volumen:</span>
                        <span>-${((config.basePrice * config.quantity) - parseFloat(calculatePrice())).toFixed(2)}</span>
                      </div>
                    )}
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${calculatePrice()}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    onClick={goToCustomizer}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Personalizar Producto
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Price Calculator */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="font-serif text-lg flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Calculadora de Precio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">${calculatePrice()}</div>
                  <div className="text-sm text-muted-foreground">Precio total</div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Precio unitario:</span>
                    <span>${config.basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cantidad:</span>
                    <span>{config.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${(config.basePrice * config.quantity).toFixed(2)}</span>
                  </div>
                  {config.quantity >= 10 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento:</span>
                      <span>-${((config.basePrice * config.quantity) - parseFloat(calculatePrice())).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="bg-accent/10 rounded p-3">
                  <div className="text-xs text-muted-foreground">
                    💡 Tip: Pide más unidades para obtener mejores precios
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        <Button
          onClick={nextStep}
          disabled={currentStep === 4}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          Siguiente
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Sample Modal */}
      {showSampleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-xl">📦 Solicitar Muestras</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowSampleModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 text-sm">
                Solicita muestras físicas para evaluar la calidad antes de hacer tu pedido completo.
              </p>
              
              <div className="space-y-4">
                {samplePricing.map((sample, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:border-secondary transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {sample.quantity} {sample.quantity === 1 ? 'Muestra' : 'Muestras'}
                        </h3>
                        <p className="text-sm text-muted-foreground">{sample.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-secondary text-lg">${sample.price}</p>
                        <p className="text-xs text-muted-foreground">
                          {sample.quantity > 1 ? 'por muestra' : 'total'}
                        </p>
                      </div>
                    </div>
                    
                    {sample.quantity > 1 && (
                      <div className="mt-3 p-2 bg-accent/10 rounded text-xs">
                        <strong>Total: ${(sample.price * sample.quantity).toFixed(2)}</strong>
                        <span className="text-muted-foreground ml-2">
                          ({sample.quantity} muestras)
                        </span>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full mt-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      onClick={() => {
                        setShowSampleModal(false)
                        // Here you would handle the sample order
                        alert(`Muestra solicitada: ${sample.quantity} ${sample.quantity === 1 ? 'unidad' : 'unidades'} - $${sample.quantity === 1 ? sample.price : (sample.price * sample.quantity).toFixed(2)}`)
                      }}
                    >
                      Solicitar {sample.quantity} {sample.quantity === 1 ? 'Muestra' : 'Muestras'}
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-3 bg-accent/5 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Tip:</strong> Las muestras incluyen tu diseño aplicado al producto seleccionado. 
                  Tiempo de entrega: 3-5 días hábiles.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
