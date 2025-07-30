export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  userName: string;
  userEmail: string;
  courseId: number;
  courseTitle: string;
  courseImage: string;
  instructorName: string;
  amount: number;
  originalAmount: number;
  discount: number;
  paymentMethod: 'alipay' | 'wechat' | 'card' | 'other';
  status: 'pending' | 'paid' | 'completed' | 'cancelled' | 'refunded';
  paymentTime?: string;
  completedTime?: string;
  refundTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFormData {
  userId: number;
  courseId: number;
  amount: number;
  originalAmount: number;
  discount: number;
  paymentMethod: 'alipay' | 'wechat' | 'card' | 'other';
  status: 'pending' | 'paid' | 'completed' | 'cancelled' | 'refunded';
  notes?: string;
}

// 模拟数据存储
class OrderManager {
  private orders: Order[] = [
    {
      id: 1,
      orderNumber: "DN20240115001",
      userId: 1,
      userName: "张三",
      userEmail: "zhangsan@example.com",
      courseId: 1,
      courseTitle: "人人都该上的百万应用创作课",
      courseImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      instructorName: "张教授",
      amount: 599,
      originalAmount: 999,
      discount: 400,
      paymentMethod: "alipay",
      status: "completed",
      paymentTime: "2024-01-15T10:30:00Z",
      completedTime: "2024-01-15T10:35:00Z",
      notes: "用户主动购买",
      createdAt: "2024-01-15T10:25:00Z",
      updatedAt: "2024-01-15T10:35:00Z"
    },
    {
      id: 2,
      orderNumber: "DN20240116001",
      userId: 2,
      userName: "李四",
      userEmail: "lisi@example.com",
      courseId: 2,
      courseTitle: "AI产品经理实战课程",
      courseImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      instructorName: "李老师",
      amount: 0,
      originalAmount: 799,
      discount: 799,
      paymentMethod: "other",
      status: "completed",
      paymentTime: "2024-01-16T14:20:00Z",
      completedTime: "2024-01-16T14:20:00Z",
      notes: "免费课程",
      createdAt: "2024-01-16T14:15:00Z",
      updatedAt: "2024-01-16T14:20:00Z"
    },
    {
      id: 3,
      orderNumber: "DN20240117001",
      userId: 3,
      userName: "王五",
      userEmail: "wangwu@example.com",
      courseId: 3,
      courseTitle: "ChatGPT编程实战",
      courseImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
      instructorName: "王工程师",
      amount: 399,
      originalAmount: 599,
      discount: 200,
      paymentMethod: "wechat",
      status: "paid",
      paymentTime: "2024-01-17T09:45:00Z",
      notes: "微信支付",
      createdAt: "2024-01-17T09:40:00Z",
      updatedAt: "2024-01-17T09:45:00Z"
    },
    {
      id: 4,
      orderNumber: "DN20240118001",
      userId: 4,
      userName: "赵六",
      userEmail: "zhaoliu@example.com",
      courseId: 1,
      courseTitle: "人人都该上的百万应用创作课",
      courseImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      instructorName: "张教授",
      amount: 599,
      originalAmount: 999,
      discount: 400,
      paymentMethod: "card",
      status: "pending",
      notes: "等待支付",
      createdAt: "2024-01-18T16:30:00Z",
      updatedAt: "2024-01-18T16:30:00Z"
    },
    {
      id: 5,
      orderNumber: "DN20240119001",
      userId: 5,
      userName: "钱七",
      userEmail: "qianqi@example.com",
      courseId: 3,
      courseTitle: "ChatGPT编程实战",
      courseImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
      instructorName: "王工程师",
      amount: 399,
      originalAmount: 599,
      discount: 200,
      paymentMethod: "alipay",
      status: "cancelled",
      notes: "用户取消订单",
      createdAt: "2024-01-19T11:20:00Z",
      updatedAt: "2024-01-19T11:25:00Z"
    },
    {
      id: 6,
      orderNumber: "DN20240120001",
      userId: 6,
      userName: "孙八",
      userEmail: "sunba@example.com",
      courseId: 1,
      courseTitle: "人人都该上的百万应用创作课",
      courseImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      instructorName: "张教授",
      amount: 599,
      originalAmount: 999,
      discount: 400,
      paymentMethod: "wechat",
      status: "refunded",
      paymentTime: "2024-01-20T13:15:00Z",
      refundTime: "2024-01-20T15:30:00Z",
      notes: "用户申请退款",
      createdAt: "2024-01-20T13:10:00Z",
      updatedAt: "2024-01-20T15:30:00Z"
    }
  ];

  private nextId = 7;

  // 获取所有订单
  async getAllOrders(): Promise<Order[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.orders]);
      }, 300);
    });
  }

  // 根据ID获取订单
  async getOrderById(id: number): Promise<Order | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = this.orders.find(o => o.id === id);
        resolve(order ? { ...order } : null);
      }, 200);
    });
  }

  // 根据订单号获取订单
  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = this.orders.find(o => o.orderNumber === orderNumber);
        resolve(order ? { ...order } : null);
      }, 200);
    });
  }

  // 创建新订单
  async createOrder(data: OrderFormData): Promise<Order> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const orderNumber = `DN${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(this.nextId).padStart(3, '0')}`;
          
          const newOrder: Order = {
            id: this.nextId++,
            orderNumber,
            userId: data.userId,
            userName: "新用户",
            userEmail: "user@example.com",
            courseId: data.courseId,
            courseTitle: "课程标题",
            courseImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
            instructorName: "讲师姓名",
            amount: data.amount,
            originalAmount: data.originalAmount,
            discount: data.discount,
            paymentMethod: data.paymentMethod,
            status: data.status,
            notes: data.notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          this.orders.push(newOrder);
          resolve({ ...newOrder });
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  }

  // 更新订单
  async updateOrder(id: number, data: Partial<OrderFormData>): Promise<Order> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const index = this.orders.findIndex(o => o.id === id);
          if (index === -1) {
            reject(new Error('订单不存在'));
            return;
          }

          const updatedOrder = {
            ...this.orders[index],
            ...data,
            updatedAt: new Date().toISOString()
          };

          this.orders[index] = updatedOrder;
          resolve({ ...updatedOrder });
        } catch (error) {
          reject(error);
        }
      }, 400);
    });
  }

  // 删除订单
  async deleteOrder(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.orders.findIndex(o => o.id === id);
        if (index !== -1) {
          this.orders.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }

  // 更新订单状态
  async updateOrderStatus(id: number, status: Order['status']): Promise<Order> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const index = this.orders.findIndex(o => o.id === id);
          if (index === -1) {
            reject(new Error('订单不存在'));
            return;
          }

          const updatedOrder = {
            ...this.orders[index],
            status,
            updatedAt: new Date().toISOString()
          };

          // 根据状态设置相应时间
          if (status === 'paid' && !updatedOrder.paymentTime) {
            updatedOrder.paymentTime = new Date().toISOString();
          } else if (status === 'completed' && !updatedOrder.completedTime) {
            updatedOrder.completedTime = new Date().toISOString();
          } else if (status === 'refunded' && !updatedOrder.refundTime) {
            updatedOrder.refundTime = new Date().toISOString();
          }

          this.orders[index] = updatedOrder;
          resolve({ ...updatedOrder });
        } catch (error) {
          reject(error);
        }
      }, 400);
    });
  }

  // 搜索订单
  async searchOrders(query: string): Promise<Order[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.orders.filter(order =>
          order.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
          order.userName.toLowerCase().includes(query.toLowerCase()) ||
          order.userEmail.toLowerCase().includes(query.toLowerCase()) ||
          order.courseTitle.toLowerCase().includes(query.toLowerCase())
        );
        resolve([...filtered]);
      }, 200);
    });
  }

  // 按状态筛选订单
  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.orders.filter(order => order.status === status);
        resolve([...filtered]);
      }, 200);
    });
  }

  // 按支付方式筛选订单
  async getOrdersByPaymentMethod(method: Order['paymentMethod']): Promise<Order[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.orders.filter(order => order.paymentMethod === method);
        resolve([...filtered]);
      }, 200);
    });
  }

  // 按日期范围筛选订单
  async getOrdersByDateRange(startDate: string, endDate: string): Promise<Order[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          const start = new Date(startDate);
          const end = new Date(endDate);
          return orderDate >= start && orderDate <= end;
        });
        resolve([...filtered]);
      }, 200);
    });
  }

  // 获取订单统计
  async getOrderStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          total: this.orders.length,
          pending: this.orders.filter(o => o.status === 'pending').length,
          paid: this.orders.filter(o => o.status === 'paid').length,
          completed: this.orders.filter(o => o.status === 'completed').length,
          cancelled: this.orders.filter(o => o.status === 'cancelled').length,
          refunded: this.orders.filter(o => o.status === 'refunded').length,
          totalRevenue: this.orders
            .filter(o => o.status === 'completed' || o.status === 'paid')
            .reduce((sum, o) => sum + o.amount, 0),
          totalDiscount: this.orders.reduce((sum, o) => sum + o.discount, 0)
        };
        resolve(stats);
      }, 100);
    });
  }

  // 获取支付方式统计
  async getPaymentMethodStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          alipay: this.orders.filter(o => o.paymentMethod === 'alipay').length,
          wechat: this.orders.filter(o => o.paymentMethod === 'wechat').length,
          card: this.orders.filter(o => o.paymentMethod === 'card').length,
          other: this.orders.filter(o => o.paymentMethod === 'other').length
        };
        resolve(stats);
      }, 100);
    });
  }
}

export const orderManager = new OrderManager(); 