import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Текстильное панно',
    price: 4500,
    image: 'https://cdn.poehali.dev/projects/3a2a3f86-0019-4b98-b0ef-1c33f60912bd/files/15e3e2eb-4d29-435e-8229-f910e4805547.jpg',
    description: 'Ручное плетение с геометрическим узором. Натуральные материалы, размер 60x80 см',
    category: 'Текстиль'
  },
  {
    id: 2,
    name: 'Макраме для растений',
    price: 2800,
    image: 'https://cdn.poehali.dev/projects/3a2a3f86-0019-4b98-b0ef-1c33f60912bd/files/59539003-7a96-482c-a254-b5760992114d.jpg',
    description: 'Подвесное кашпо из хлопкового шнура с деревянными бусинами',
    category: 'Декор'
  },
  {
    id: 3,
    name: 'Керамическая ваза',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&h=800&fit=crop',
    description: 'Авторская керамика ручной работы, глазурь молочного оттенка',
    category: 'Керамика'
  },
  {
    id: 4,
    name: 'Плетеная корзина',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1585933646077-f4664357e8b8?w=600&h=800&fit=crop',
    description: 'Корзина из ротанга, идеальна для хранения и декора',
    category: 'Декор'
  },
  {
    id: 5,
    name: 'Льняная скатерть',
    price: 3800,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=800&fit=crop',
    description: 'Натуральный лен с ручной вышивкой, 140x200 см',
    category: 'Текстиль'
  },
  {
    id: 6,
    name: 'Глиняная тарелка',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=800&fit=crop',
    description: 'Авторская керамика с органичным узором, диаметр 25 см',
    category: 'Керамика'
  }
];

export default function Index() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customOrderOpen, setCustomOrderOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const { toast } = useToast();

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({ description: 'Товар добавлен в корзину' });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCustomOrder = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ description: 'Заявка отправлена! Мы свяжемся с вами в ближайшее время.' });
    setCustomOrderOpen(false);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Ручная работа</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setCustomOrderOpen(true)}>
              Индивидуальный заказ
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingBag" size={20} />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <div key={item.id} className="flex gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Icon name="Minus" size={14} />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Icon name="Plus" size={14} />
                              </Button>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Icon name="X" size={18} />
                          </Button>
                        </div>
                      ))}
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between text-lg font-semibold mb-4">
                          <span>Итого:</span>
                          <span>{totalPrice.toLocaleString()} ₽</span>
                        </div>
                        <Button className="w-full" size="lg">
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="py-12 md:py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Изделия ручной работы
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
            Уникальные предметы интерьера, созданные с душой и вниманием к деталям
          </p>
          <Button size="lg" className="animate-scale-in" onClick={() => setCustomOrderOpen(true)}>
            Индивидуальный заказ
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, index) => (
              <Card
                key={product.id}
                className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <Badge variant="secondary" className="shrink-0">
                      {product.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">{product.price.toLocaleString()} ₽</span>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      В корзину
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl">
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedProduct.name}</DialogTitle>
                  <Badge variant="secondary" className="w-fit">
                    {selectedProduct.category}
                  </Badge>
                </DialogHeader>
                <DialogDescription className="text-base mt-4">
                  {selectedProduct.description}
                </DialogDescription>
                <div className="mt-auto pt-6 space-y-4">
                  <div className="text-3xl font-bold">
                    {selectedProduct.price.toLocaleString()} ₽
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    Добавить в корзину
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={customOrderOpen} onOpenChange={setCustomOrderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Индивидуальный заказ</DialogTitle>
            <DialogDescription>
              Опишите ваши пожелания, и мы создадим уникальное изделие специально для вас
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCustomOrder} className="space-y-4 mt-4">
            <div>
              <Input
                placeholder="Ваше имя"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Textarea
                placeholder="Опишите ваши пожелания..."
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Отправить заявку
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <footer className="bg-muted/50 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-bold text-lg mb-4">О нас</h3>
              <p className="text-sm text-muted-foreground">
                Создаём уникальные изделия ручной работы с любовью и вниманием к деталям
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Контакты</h3>
              <p className="text-sm text-muted-foreground">Email: hello@handmade.ru</p>
              <p className="text-sm text-muted-foreground">Телефон: +7 (999) 123-45-67</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Доставка</h3>
              <p className="text-sm text-muted-foreground">
                Доставка по всей России. Бережная упаковка каждого изделия
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
