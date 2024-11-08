import { v4 as uuidv4 } from 'uuid'

// [Unit Test][Order Service] - [getOrderOfCurrentUser]
export const dataGetOrdeOfCurrentUser = {
  foundOrder: {
    _id: '672ce9f153b54c2edc1408e6',
    products: [
      {
        product: {
          _id: '667283d8322b41490e8f7596',
          title: 'USB SanDisk',
          slug: 'usb-sandisk-1718780888963',
          sold: 16,
          thumb: {
            url: 'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
            id: ''
          },
          variants: [
            {
              name: 'Blue',
              images: [
                'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
                'https://digital-world-2.myshopify.com/cdn/shop/products/z5_1024x1024.jpg?v=1491404811'
              ],
              quantity: 76,
              _id: '667283d8322b41490e8f7597'
            },
            {
              name: 'Black',
              images: [
                'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
                'https://digital-world-2.myshopify.com/cdn/shop/products/z5_1024x1024.jpg?v=1491404811'
              ],
              quantity: 5,
              _id: '667283d8322b41490e8f7598'
            },
            {
              name: 'Gold',
              images: [
                'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
                'https://digital-world-2.myshopify.com/cdn/shop/products/z5_1024x1024.jpg?v=1491404811'
              ],
              quantity: 6,
              _id: '667283d8322b41490e8f7599'
            },
            {
              name: 'White',
              images: [
                'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
                'https://digital-world-2.myshopify.com/cdn/shop/products/z5_1024x1024.jpg?v=1491404811'
              ],
              quantity: 67,
              _id: '667283d8322b41490e8f759a'
            }
          ],
          averageRatings: 4,
          quantity: 154
        },
        variant: '667283d8322b41490e8f7598',
        quantity: 1,
        oldPrice: 0,
        price: 7
      }
    ],
    shippingAddress: '671511c273d4bbaacba2f8d2',
    paymentMethod: 'ONLINE_PAYMENT',
    shippingFee: 3.09,
    status: 'PAID',
    statusHistory: [
      {
        status: 'PENDING',
        date: '2024-11-07T16:25:21.422Z'
      }
    ],
    createdAt: '2024-11-07T16:25:21.383Z',
    updatedAt: '2024-11-07T16:25:21.422Z'
  },
  exchangeRate: 25392.4,
  orderConverted: {
    _id: '672ce9f153b54c2edc1408e6',
    products: [
      {
        product: {
          _id: '667283d8322b41490e8f7596',
          title: 'USB SanDisk',
          slug: 'usb-sandisk-1718780888963',
          sold: 16,
          thumb: {
            url: 'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
            id: ''
          },
          variants: [
            {
              name: 'Blue',
              images: [
                'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
                'https://digital-world-2.myshopify.com/cdn/shop/products/z5_1024x1024.jpg?v=1491404811'
              ],
              quantity: 76,
              _id: '667283d8322b41490e8f7597'
            },
            {
              name: 'Black',
              images: [
                'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
                'https://digital-world-2.myshopify.com/cdn/shop/products/z5_1024x1024.jpg?v=1491404811'
              ],
              quantity: 5,
              _id: '667283d8322b41490e8f7598'
            },
            {
              name: 'Gold',
              images: [
                'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
                'https://digital-world-2.myshopify.com/cdn/shop/products/z5_1024x1024.jpg?v=1491404811'
              ],
              quantity: 6,
              _id: '667283d8322b41490e8f7599'
            },
            {
              name: 'White',
              images: [
                'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
                'https://digital-world-2.myshopify.com/cdn/shop/products/z5_1024x1024.jpg?v=1491404811'
              ],
              quantity: 67,
              _id: '667283d8322b41490e8f759a'
            }
          ],
          averageRatings: 4,
          quantity: 154
        },
        variant: '667283d8322b41490e8f7598',
        quantity: 1,
        oldPrice: 0,
        price: 7
      }
    ],
    shippingAddress: '671511c273d4bbaacba2f8d2',
    paymentMethod: 'ONLINE_PAYMENT',
    shippingFee: 3.09,
    status: 'PAID',
    statusHistory: [
      {
        status: 'PENDING',
        date: '2024-11-07T16:25:21.422Z'
      }
    ],
    createdAt: '2024-11-07T16:25:21.383Z',
    updatedAt: '2024-11-07T16:25:21.422Z',
    totalProductsPrice: 7,
    totalPayment: 10.09
  },
  shippingAddress: {
    _id: '671511c273d4bbaacba2f8d2',
    firstName: 'grweagre',
    lastName: 'regreg',
    phoneNumber: '0834480248',
    streetAddress: '1234',
    createdAt: '2024-10-20T14:20:50.387Z',
    updatedAt: '2024-10-20T14:20:50.387Z',
    province: {
      id: 217,
      code: '76',
      name: 'An Giang',
      nameExtension: ['An Giang', 'Tỉnh An Giang', 'T.An Giang', 'T An Giang', 'angiang']
    },
    district: {
      provinceId: 217,
      id: 1754,
      code: '5103',
      name: 'Huyện An Phú',
      nameExtension: ['Huyện An Phú', 'H.An Phú', 'H An Phú', 'An Phú', 'An Phu', 'Huyen An Phu', 'anphu']
    },
    ward: {
      districtId: 1754,
      code: '510301',
      name: 'Thị trấn An Phú',
      nameExtension: ['Thị trấn An Phú', 'TT.An Phú', 'TT An Phú', 'An Phú', 'An Phu', 'Thi tran An Phu', 'anphu']
    },
    default: true
  },
  orderCurrency: {
    _id: '672ce9f153b54c2edc1408e6',
    products: [
      {
        product: {
          _id: '667283d8322b41490e8f7596',
          title: 'USB SanDisk',
          slug: 'usb-sandisk-1718780888963',
          sold: 16,
          thumb: {
            url: 'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
            id: ''
          },
          averageRatings: 4
        },
        variant: {
          name: 'Black',
          images: [
            'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
            'https://digital-world-2.myshopify.com/cdn/shop/products/z5_1024x1024.jpg?v=1491404811'
          ],
          _id: '667283d8322b41490e8f7598'
        },
        quantity: 1,
        oldPrice: 0,
        price: 177746.80000000002
      }
    ],
    shippingAddress: {
      _id: '671511c273d4bbaacba2f8d2',
      firstName: 'grweagre',
      lastName: 'regreg',
      phoneNumber: '0834480248',
      streetAddress: '1234',
      createdAt: '2024-10-20T14:20:50.387Z',
      updatedAt: '2024-10-20T14:20:50.387Z',
      province: {
        id: 217,
        code: '76',
        name: 'An Giang',
        nameExtension: ['An Giang', 'Tỉnh An Giang', 'T.An Giang', 'T An Giang', 'angiang']
      },
      district: {
        provinceId: 217,
        id: 1754,
        code: '5103',
        name: 'Huyện An Phú',
        nameExtension: ['Huyện An Phú', 'H.An Phú', 'H An Phú', 'An Phú', 'An Phu', 'Huyen An Phu', 'anphu']
      },
      ward: {
        districtId: 1754,
        code: '510301',
        name: 'Thị trấn An Phú',
        nameExtension: ['Thị trấn An Phú', 'TT.An Phú', 'TT An Phú', 'An Phú', 'An Phu', 'Thi tran An Phu', 'anphu']
      },
      default: true
    },
    paymentMethod: 'ONLINE_PAYMENT',
    shippingFee: 78462.516,
    status: 'PAID',
    statusHistory: [
      {
        status: 'PENDING',
        date: '2024-11-07T16:25:21.422Z'
      }
    ],
    createdAt: '2024-11-07T16:25:21.383Z',
    updatedAt: '2024-11-07T16:25:21.422Z',
    totalProductsPrice: 177746.80000000002,
    totalPayment: 256209.31600000002
  }
}

export const dataGetOrdersOfCurrentUser = {
  foundOrders: [
    {
      _id: '672ce9f153b54c2edc1408e6',
      products: [
        {
          product: {
            _id: '667283d8322b41490e8f7596',
            title: 'USB SanDisk',
            slug: 'usb-sandisk-1718780888963',
            sold: 16,
            thumb: {
              url: 'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
              id: ''
            },
            variants: [
              {
                name: 'Blue',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z5_1024x1024.jpg?v=1491404811'
                ],
                quantity: 76,
                _id: '667283d8322b41490e8f7597'
              },
              {
                name: 'Black',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z5_1024x1024.jpg?v=1491404811'
                ],
                quantity: 5,
                _id: '667283d8322b41490e8f7598'
              },
              {
                name: 'Gold',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z5_1024x1024.jpg?v=1491404811'
                ],
                quantity: 6,
                _id: '667283d8322b41490e8f7599'
              },
              {
                name: 'White',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z5_1024x1024.jpg?v=1491404811'
                ],
                quantity: 67,
                _id: '667283d8322b41490e8f759a'
              }
            ],
            averageRatings: 4,
            quantity: 154
          },
          variant: '667283d8322b41490e8f7598',
          quantity: 1,
          oldPrice: 0,
          price: 7
        }
      ],
      shippingAddress: '671511c273d4bbaacba2f8d2',
      paymentMethod: 'ONLINE_PAYMENT',
      shippingFee: 3.09,
      status: 'PAID',
      statusHistory: [
        {
          status: 'PENDING',
          date: '2024-11-07T16:25:21.422Z'
        }
      ],
      createdAt: '2024-11-07T16:25:21.383Z',
      updatedAt: '2024-11-07T16:25:21.422Z'
    },
    {
      _id: '67151e6c375402767e36ec63',
      products: [
        {
          product: {
            _id: '667283d9322b41490e8f75a0',
            title: 'Apple Watch Edition Series 2',
            slug: 'apple-watch-edition-series-2-1718780889002',
            sold: 58,
            thumb: {
              url: 'https://digital-world-2.myshopify.com/cdn/shop/products/Untitled-123_1024x1024.jpg?v=1491404922',
              id: ''
            },
            variants: [
              {
                name: 'Blue',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/Untitled-123_1024x1024.jpg?v=1491404922',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/apple-watch2-edition-42mm2_1024x1024.jpg?v=1491404922'
                ],
                quantity: 72,
                _id: '667283d9322b41490e8f75a1'
              },
              {
                name: 'Blue',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/Untitled-123_1024x1024.jpg?v=1491404922',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/apple-watch2-edition-42mm2_1024x1024.jpg?v=1491404922'
                ],
                quantity: 43,
                _id: '667283d9322b41490e8f75a2'
              },
              {
                name: 'White',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/Untitled-123_1024x1024.jpg?v=1491404922',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/apple-watch2-edition-42mm2_1024x1024.jpg?v=1491404922'
                ],
                quantity: 92,
                _id: '667283d9322b41490e8f75a3'
              },
              {
                name: 'Gold',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/Untitled-123_1024x1024.jpg?v=1491404922',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/apple-watch2-edition-42mm2_1024x1024.jpg?v=1491404922'
                ],
                quantity: 22,
                _id: '667283d9322b41490e8f75a4'
              }
            ],
            averageRatings: 4,
            quantity: 229
          },
          variant: '667283d9322b41490e8f75a2',
          quantity: 2,
          oldPrice: 399,
          price: 359
        }
      ],
      shippingAddress: '671511c273d4bbaacba2f8d2',
      paymentMethod: 'ONLINE_PAYMENT',
      shippingFee: 2.71,
      status: 'PENDING',
      statusHistory: [],
      createdAt: '2024-10-20T15:14:52.848Z',
      updatedAt: '2024-10-20T15:14:52.848Z'
    },
    {
      _id: '6715165b375402767e36eb4a',
      products: [
        {
          product: {
            _id: '667283d9322b41490e8f75a0',
            title: 'Apple Watch Edition Series 2',
            slug: 'apple-watch-edition-series-2-1718780889002',
            sold: 58,
            thumb: {
              url: 'https://digital-world-2.myshopify.com/cdn/shop/products/Untitled-123_1024x1024.jpg?v=1491404922',
              id: ''
            },
            variants: [
              {
                name: 'Blue',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/Untitled-123_1024x1024.jpg?v=1491404922',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/apple-watch2-edition-42mm2_1024x1024.jpg?v=1491404922'
                ],
                quantity: 72,
                _id: '667283d9322b41490e8f75a1'
              },
              {
                name: 'Blue',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/Untitled-123_1024x1024.jpg?v=1491404922',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/apple-watch2-edition-42mm2_1024x1024.jpg?v=1491404922'
                ],
                quantity: 43,
                _id: '667283d9322b41490e8f75a2'
              },
              {
                name: 'White',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/Untitled-123_1024x1024.jpg?v=1491404922',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/apple-watch2-edition-42mm2_1024x1024.jpg?v=1491404922'
                ],
                quantity: 92,
                _id: '667283d9322b41490e8f75a3'
              },
              {
                name: 'Gold',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/Untitled-123_1024x1024.jpg?v=1491404922',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/apple-watch2-edition-42mm2_1024x1024.jpg?v=1491404922'
                ],
                quantity: 22,
                _id: '667283d9322b41490e8f75a4'
              }
            ],
            averageRatings: 4,
            quantity: 229
          },
          variant: '667283d9322b41490e8f75a2',
          quantity: 2,
          oldPrice: 399,
          price: 359
        }
      ],
      shippingAddress: '671511c273d4bbaacba2f8d2',
      paymentMethod: 'ONLINE_PAYMENT',
      shippingFee: 2.71,
      status: 'PAID',
      statusHistory: [
        {
          status: 'PENDING',
          date: '2024-10-20T14:41:27.207Z'
        }
      ],
      createdAt: '2024-10-20T14:40:27.955Z',
      updatedAt: '2024-10-20T14:41:27.205Z'
    },
    {
      _id: '6715134269663b7230c9b670',
      products: [
        {
          product: {
            _id: '667283d9322b41490e8f75a0',
            title: 'Apple Watch Edition Series 2',
            slug: 'apple-watch-edition-series-2-1718780889002',
            sold: 58,
            thumb: {
              url: 'https://digital-world-2.myshopify.com/cdn/shop/products/Untitled-123_1024x1024.jpg?v=1491404922',
              id: ''
            },
            variants: [
              {
                name: 'Blue',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/Untitled-123_1024x1024.jpg?v=1491404922',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/apple-watch2-edition-42mm2_1024x1024.jpg?v=1491404922'
                ],
                quantity: 72,
                _id: '667283d9322b41490e8f75a1'
              },
              {
                name: 'Blue',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/Untitled-123_1024x1024.jpg?v=1491404922',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/apple-watch2-edition-42mm2_1024x1024.jpg?v=1491404922'
                ],
                quantity: 43,
                _id: '667283d9322b41490e8f75a2'
              },
              {
                name: 'White',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/Untitled-123_1024x1024.jpg?v=1491404922',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/apple-watch2-edition-42mm2_1024x1024.jpg?v=1491404922'
                ],
                quantity: 92,
                _id: '667283d9322b41490e8f75a3'
              },
              {
                name: 'Gold',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/Untitled-123_1024x1024.jpg?v=1491404922',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/apple-watch2-edition-42mm2_1024x1024.jpg?v=1491404922'
                ],
                quantity: 22,
                _id: '667283d9322b41490e8f75a4'
              }
            ],
            averageRatings: 4,
            quantity: 229
          },
          variant: '667283d9322b41490e8f75a2',
          quantity: 2,
          oldPrice: 399,
          price: 359
        }
      ],
      shippingAddress: '671511c273d4bbaacba2f8d2',
      paymentMethod: 'ONLINE_PAYMENT',
      shippingFee: 2.71,
      status: 'PAID',
      statusHistory: [
        {
          status: 'PENDING',
          date: '2024-10-20T14:35:19.026Z'
        }
      ],
      createdAt: '2024-10-20T14:27:14.501Z',
      updatedAt: '2024-10-20T14:35:19.025Z'
    },
    {
      _id: '6715130869663b7230c9b58d',
      products: [
        {
          product: {
            _id: '667283df322b41490e8f764f',
            title: 'Apple Macbook Pro 13"',
            slug: 'apple-macbook-pro-13-1718780895049',
            sold: 13,
            thumb: {
              url: 'https://digital-world-2.myshopify.com/cdn/shop/products/z6_1_1024x1024.jpg?v=1491404800',
              id: ''
            },
            variants: [
              {
                name: 'Blue',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z6_1_1024x1024.jpg?v=1491404800',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1_4c7eeac9-df0b-4725-8a45-cb6c87b42eba_1024x1024.jpg?v=1491404800',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z5_1_1024x1024.jpg?v=1491404800'
                ],
                quantity: 74,
                _id: '667283df322b41490e8f7650'
              },
              {
                name: 'Black',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z6_1_1024x1024.jpg?v=1491404800',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1_4c7eeac9-df0b-4725-8a45-cb6c87b42eba_1024x1024.jpg?v=1491404800',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z5_1_1024x1024.jpg?v=1491404800'
                ],
                quantity: 63,
                _id: '667283df322b41490e8f7651'
              },
              {
                name: 'White',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z6_1_1024x1024.jpg?v=1491404800',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1_4c7eeac9-df0b-4725-8a45-cb6c87b42eba_1024x1024.jpg?v=1491404800',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z5_1_1024x1024.jpg?v=1491404800'
                ],
                quantity: 91,
                _id: '667283df322b41490e8f7652'
              },
              {
                name: 'Black',
                images: [
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z6_1_1024x1024.jpg?v=1491404800',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1_4c7eeac9-df0b-4725-8a45-cb6c87b42eba_1024x1024.jpg?v=1491404800',
                  'https://digital-world-2.myshopify.com/cdn/shop/products/z5_1_1024x1024.jpg?v=1491404800'
                ],
                quantity: 42,
                _id: '667283df322b41490e8f7653'
              }
            ],
            averageRatings: 4,
            quantity: 270
          },
          variant: '667283df322b41490e8f7651',
          quantity: 2,
          oldPrice: 316,
          price: 280
        }
      ],
      shippingAddress: '671511c273d4bbaacba2f8d2',
      paymentMethod: 'ONLINE_PAYMENT',
      shippingFee: 2.45,
      status: 'PAID',
      statusHistory: [
        {
          status: 'PENDING',
          date: '2024-10-20T14:26:16.330Z'
        }
      ],
      createdAt: '2024-10-20T14:26:16.297Z',
      updatedAt: '2024-10-20T14:26:16.329Z'
    }
  ],
  shippingAddresses: [
    {
      _id: '671511c273d4bbaacba2f8d2',
      firstName: 'grweagre',
      lastName: 'regreg',
      phoneNumber: '0834480248',
      streetAddress: '1234',
      createdAt: '2024-10-20T14:20:50.387Z',
      updatedAt: '2024-10-20T14:20:50.387Z',
      province: {
        id: 217,
        code: '76',
        name: 'An Giang',
        nameExtension: ['An Giang', 'Tỉnh An Giang', 'T.An Giang', 'T An Giang', 'angiang']
      },
      district: {
        provinceId: 217,
        id: 1754,
        code: '5103',
        name: 'Huyện An Phú',
        nameExtension: ['Huyện An Phú', 'H.An Phú', 'H An Phú', 'An Phú', 'An Phu', 'Huyen An Phu', 'anphu']
      },
      ward: {
        districtId: 1754,
        code: '510301',
        name: 'Thị trấn An Phú',
        nameExtension: ['Thị trấn An Phú', 'TT.An Phú', 'TT An Phú', 'An Phú', 'An Phu', 'Thi tran An Phu', 'anphu']
      },
      default: true
    },
    {
      _id: '671511c273d4bbaacba2f8d2',
      firstName: 'grweagre',
      lastName: 'regreg',
      phoneNumber: '0834480248',
      streetAddress: '1234',
      createdAt: '2024-10-20T14:20:50.387Z',
      updatedAt: '2024-10-20T14:20:50.387Z',
      province: {
        id: 217,
        code: '76',
        name: 'An Giang',
        nameExtension: ['An Giang', 'Tỉnh An Giang', 'T.An Giang', 'T An Giang', 'angiang']
      },
      district: {
        provinceId: 217,
        id: 1754,
        code: '5103',
        name: 'Huyện An Phú',
        nameExtension: ['Huyện An Phú', 'H.An Phú', 'H An Phú', 'An Phú', 'An Phu', 'Huyen An Phu', 'anphu']
      },
      ward: {
        districtId: 1754,
        code: '510301',
        name: 'Thị trấn An Phú',
        nameExtension: ['Thị trấn An Phú', 'TT.An Phú', 'TT An Phú', 'An Phú', 'An Phu', 'Thi tran An Phu', 'anphu']
      },
      default: true
    },
    {
      _id: '671511c273d4bbaacba2f8d2',
      firstName: 'grweagre',
      lastName: 'regreg',
      phoneNumber: '0834480248',
      streetAddress: '1234',
      createdAt: '2024-10-20T14:20:50.387Z',
      updatedAt: '2024-10-20T14:20:50.387Z',
      province: {
        id: 217,
        code: '76',
        name: 'An Giang',
        nameExtension: ['An Giang', 'Tỉnh An Giang', 'T.An Giang', 'T An Giang', 'angiang']
      },
      district: {
        provinceId: 217,
        id: 1754,
        code: '5103',
        name: 'Huyện An Phú',
        nameExtension: ['Huyện An Phú', 'H.An Phú', 'H An Phú', 'An Phú', 'An Phu', 'Huyen An Phu', 'anphu']
      },
      ward: {
        districtId: 1754,
        code: '510301',
        name: 'Thị trấn An Phú',
        nameExtension: ['Thị trấn An Phú', 'TT.An Phú', 'TT An Phú', 'An Phú', 'An Phu', 'Thi tran An Phu', 'anphu']
      },
      default: true
    },
    {
      _id: '671511c273d4bbaacba2f8d2',
      firstName: 'grweagre',
      lastName: 'regreg',
      phoneNumber: '0834480248',
      streetAddress: '1234',
      createdAt: '2024-10-20T14:20:50.387Z',
      updatedAt: '2024-10-20T14:20:50.387Z',
      province: {
        id: 217,
        code: '76',
        name: 'An Giang',
        nameExtension: ['An Giang', 'Tỉnh An Giang', 'T.An Giang', 'T An Giang', 'angiang']
      },
      district: {
        provinceId: 217,
        id: 1754,
        code: '5103',
        name: 'Huyện An Phú',
        nameExtension: ['Huyện An Phú', 'H.An Phú', 'H An Phú', 'An Phú', 'An Phu', 'Huyen An Phu', 'anphu']
      },
      ward: {
        districtId: 1754,
        code: '510301',
        name: 'Thị trấn An Phú',
        nameExtension: ['Thị trấn An Phú', 'TT.An Phú', 'TT An Phú', 'An Phú', 'An Phu', 'Thi tran An Phu', 'anphu']
      },
      default: true
    },
    {
      _id: '671511c273d4bbaacba2f8d2',
      firstName: 'grweagre',
      lastName: 'regreg',
      phoneNumber: '0834480248',
      streetAddress: '1234',
      createdAt: '2024-10-20T14:20:50.387Z',
      updatedAt: '2024-10-20T14:20:50.387Z',
      province: {
        id: 217,
        code: '76',
        name: 'An Giang',
        nameExtension: ['An Giang', 'Tỉnh An Giang', 'T.An Giang', 'T An Giang', 'angiang']
      },
      district: {
        provinceId: 217,
        id: 1754,
        code: '5103',
        name: 'Huyện An Phú',
        nameExtension: ['Huyện An Phú', 'H.An Phú', 'H An Phú', 'An Phú', 'An Phu', 'Huyen An Phu', 'anphu']
      },
      ward: {
        districtId: 1754,
        code: '510301',
        name: 'Thị trấn An Phú',
        nameExtension: ['Thị trấn An Phú', 'TT.An Phú', 'TT An Phú', 'An Phú', 'An Phu', 'Thi tran An Phu', 'anphu']
      },
      default: true
    }
  ],
  exchangeRate: 25392.4,
  totalOrders: {
    page: 1,
    limit: 100,
    totalPages: 1,
    totalItems: 5,
    items: [
      {
        _id: '672ce9f153b54c2edc1408e6',
        products: [
          {
            product: {
              _id: '667283d8322b41490e8f7596',
              title: 'USB SanDisk',
              slug: 'usb-sandisk-1718780888963',
              sold: 16,
              thumb: {
                url: 'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
                id: ''
              },
              averageRatings: 4
            },
            variant: {},
            quantity: 1,
            oldPrice: 0,
            price: 1.8763789179294462e27
          }
        ],
        shippingAddress: {
          _id: '671511c273d4bbaacba2f8d2',
          firstName: 'grweagre',
          lastName: 'regreg',
          phoneNumber: '0834480248',
          streetAddress: '1234',
          createdAt: '2024-10-20T14:20:50.387Z',
          updatedAt: '2024-10-20T14:20:50.387Z',
          province: {
            id: 217,
            code: '76',
            name: 'An Giang',
            nameExtension: ['An Giang', 'Tỉnh An Giang', 'T.An Giang', 'T An Giang', 'angiang']
          },
          district: {
            provinceId: 217,
            id: 1754,
            code: '5103',
            name: 'Huyện An Phú',
            nameExtension: ['Huyện An Phú', 'H.An Phú', 'H An Phú', 'An Phú', 'An Phu', 'Huyen An Phu', 'anphu']
          },
          ward: {
            districtId: 1754,
            code: '510301',
            name: 'Thị trấn An Phú',
            nameExtension: [
              'Thị trấn An Phú',
              'TT.An Phú',
              'TT An Phú',
              'An Phú',
              'An Phu',
              'Thi tran An Phu',
              'anphu'
            ]
          },
          default: true
        },
        paymentMethod: 'ONLINE_PAYMENT',
        shippingFee: 78462.516,
        status: 'PAID',
        statusHistory: [
          {
            status: 'PENDING',
            date: '2024-11-07T16:25:21.422Z'
          }
        ],
        createdAt: '2024-11-07T16:25:21.383Z',
        updatedAt: '2024-11-07T16:25:21.422Z',
        totalProductsPrice: 177746.80000000002,
        totalPayment: 256209.31600000002
      },
      {
        _id: '672ce9f153b54c2edc1408e6',
        products: [
          {
            product: {
              _id: '667283d8322b41490e8f7596',
              title: 'USB SanDisk',
              slug: 'usb-sandisk-1718780888963',
              sold: 16,
              thumb: {
                url: 'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
                id: ''
              },
              averageRatings: 4
            },
            variant: {},
            quantity: 1,
            oldPrice: 0,
            price: 1.8763789179294462e27
          }
        ],
        shippingAddress: {
          _id: '671511c273d4bbaacba2f8d2',
          firstName: 'grweagre',
          lastName: 'regreg',
          phoneNumber: '0834480248',
          streetAddress: '1234',
          createdAt: '2024-10-20T14:20:50.387Z',
          updatedAt: '2024-10-20T14:20:50.387Z',
          province: {
            id: 217,
            code: '76',
            name: 'An Giang',
            nameExtension: ['An Giang', 'Tỉnh An Giang', 'T.An Giang', 'T An Giang', 'angiang']
          },
          district: {
            provinceId: 217,
            id: 1754,
            code: '5103',
            name: 'Huyện An Phú',
            nameExtension: ['Huyện An Phú', 'H.An Phú', 'H An Phú', 'An Phú', 'An Phu', 'Huyen An Phu', 'anphu']
          },
          ward: {
            districtId: 1754,
            code: '510301',
            name: 'Thị trấn An Phú',
            nameExtension: [
              'Thị trấn An Phú',
              'TT.An Phú',
              'TT An Phú',
              'An Phú',
              'An Phu',
              'Thi tran An Phu',
              'anphu'
            ]
          },
          default: true
        },
        paymentMethod: 'ONLINE_PAYMENT',
        shippingFee: 78462.516,
        status: 'PAID',
        statusHistory: [
          {
            status: 'PENDING',
            date: '2024-11-07T16:25:21.422Z'
          }
        ],
        createdAt: '2024-11-07T16:25:21.383Z',
        updatedAt: '2024-11-07T16:25:21.422Z',
        totalProductsPrice: 177746.80000000002,
        totalPayment: 256209.31600000002
      },
      {
        _id: '672ce9f153b54c2edc1408e6',
        products: [
          {
            product: {
              _id: '667283d8322b41490e8f7596',
              title: 'USB SanDisk',
              slug: 'usb-sandisk-1718780888963',
              sold: 16,
              thumb: {
                url: 'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
                id: ''
              },
              averageRatings: 4
            },
            variant: {},
            quantity: 1,
            oldPrice: 0,
            price: 1.8763789179294462e27
          }
        ],
        shippingAddress: {
          _id: '671511c273d4bbaacba2f8d2',
          firstName: 'grweagre',
          lastName: 'regreg',
          phoneNumber: '0834480248',
          streetAddress: '1234',
          createdAt: '2024-10-20T14:20:50.387Z',
          updatedAt: '2024-10-20T14:20:50.387Z',
          province: {
            id: 217,
            code: '76',
            name: 'An Giang',
            nameExtension: ['An Giang', 'Tỉnh An Giang', 'T.An Giang', 'T An Giang', 'angiang']
          },
          district: {
            provinceId: 217,
            id: 1754,
            code: '5103',
            name: 'Huyện An Phú',
            nameExtension: ['Huyện An Phú', 'H.An Phú', 'H An Phú', 'An Phú', 'An Phu', 'Huyen An Phu', 'anphu']
          },
          ward: {
            districtId: 1754,
            code: '510301',
            name: 'Thị trấn An Phú',
            nameExtension: [
              'Thị trấn An Phú',
              'TT.An Phú',
              'TT An Phú',
              'An Phú',
              'An Phu',
              'Thi tran An Phu',
              'anphu'
            ]
          },
          default: true
        },
        paymentMethod: 'ONLINE_PAYMENT',
        shippingFee: 78462.516,
        status: 'PAID',
        statusHistory: [
          {
            status: 'PENDING',
            date: '2024-11-07T16:25:21.422Z'
          }
        ],
        createdAt: '2024-11-07T16:25:21.383Z',
        updatedAt: '2024-11-07T16:25:21.422Z',
        totalProductsPrice: 177746.80000000002,
        totalPayment: 256209.31600000002
      },
      {
        _id: '672ce9f153b54c2edc1408e6',
        products: [
          {
            product: {
              _id: '667283d8322b41490e8f7596',
              title: 'USB SanDisk',
              slug: 'usb-sandisk-1718780888963',
              sold: 16,
              thumb: {
                url: 'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
                id: ''
              },
              averageRatings: 4
            },
            variant: {},
            quantity: 1,
            oldPrice: 0,
            price: 1.8763789179294462e27
          }
        ],
        shippingAddress: {
          _id: '671511c273d4bbaacba2f8d2',
          firstName: 'grweagre',
          lastName: 'regreg',
          phoneNumber: '0834480248',
          streetAddress: '1234',
          createdAt: '2024-10-20T14:20:50.387Z',
          updatedAt: '2024-10-20T14:20:50.387Z',
          province: {
            id: 217,
            code: '76',
            name: 'An Giang',
            nameExtension: ['An Giang', 'Tỉnh An Giang', 'T.An Giang', 'T An Giang', 'angiang']
          },
          district: {
            provinceId: 217,
            id: 1754,
            code: '5103',
            name: 'Huyện An Phú',
            nameExtension: ['Huyện An Phú', 'H.An Phú', 'H An Phú', 'An Phú', 'An Phu', 'Huyen An Phu', 'anphu']
          },
          ward: {
            districtId: 1754,
            code: '510301',
            name: 'Thị trấn An Phú',
            nameExtension: [
              'Thị trấn An Phú',
              'TT.An Phú',
              'TT An Phú',
              'An Phú',
              'An Phu',
              'Thi tran An Phu',
              'anphu'
            ]
          },
          default: true
        },
        paymentMethod: 'ONLINE_PAYMENT',
        shippingFee: 78462.516,
        status: 'PAID',
        statusHistory: [
          {
            status: 'PENDING',
            date: '2024-11-07T16:25:21.422Z'
          }
        ],
        createdAt: '2024-11-07T16:25:21.383Z',
        updatedAt: '2024-11-07T16:25:21.422Z',
        totalProductsPrice: 177746.80000000002,
        totalPayment: 256209.31600000002
      },
      {
        _id: '672ce9f153b54c2edc1408e6',
        products: [
          {
            product: {
              _id: '667283d8322b41490e8f7596',
              title: 'USB SanDisk',
              slug: 'usb-sandisk-1718780888963',
              sold: 16,
              thumb: {
                url: 'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811',
                id: ''
              },
              averageRatings: 4
            },
            variant: {},
            quantity: 1,
            oldPrice: 0,
            price: 1.8763789179294462e27
          }
        ],
        shippingAddress: {
          _id: '671511c273d4bbaacba2f8d2',
          firstName: 'grweagre',
          lastName: 'regreg',
          phoneNumber: '0834480248',
          streetAddress: '1234',
          createdAt: '2024-10-20T14:20:50.387Z',
          updatedAt: '2024-10-20T14:20:50.387Z',
          province: {
            id: 217,
            code: '76',
            name: 'An Giang',
            nameExtension: ['An Giang', 'Tỉnh An Giang', 'T.An Giang', 'T An Giang', 'angiang']
          },
          district: {
            provinceId: 217,
            id: 1754,
            code: '5103',
            name: 'Huyện An Phú',
            nameExtension: ['Huyện An Phú', 'H.An Phú', 'H An Phú', 'An Phú', 'An Phu', 'Huyen An Phu', 'anphu']
          },
          ward: {
            districtId: 1754,
            code: '510301',
            name: 'Thị trấn An Phú',
            nameExtension: [
              'Thị trấn An Phú',
              'TT.An Phú',
              'TT An Phú',
              'An Phú',
              'An Phu',
              'Thi tran An Phu',
              'anphu'
            ]
          },
          default: true
        },
        paymentMethod: 'ONLINE_PAYMENT',
        shippingFee: 78462.516,
        status: 'PAID',
        statusHistory: [
          {
            status: 'PENDING',
            date: '2024-11-07T16:25:21.422Z'
          }
        ],
        createdAt: '2024-11-07T16:25:21.383Z',
        updatedAt: '2024-11-07T16:25:21.422Z',
        totalProductsPrice: 177746.80000000002,
        totalPayment: 256209.31600000002
      }
    ]
  }
}

export const dataSignUp = {
  users: [
    {
      _id: uuidv4(),
      firstName: 'A',
      lastName: 'Nguyen Van',
      email: 'nguyenvana@gmail.com'
    },
    {
      _id: uuidv4(),
      firstName: 'B',
      lastName: 'Nguyen Van',
      email: 'nguyenvanb@gmail.com'
    },
    {
      _id: uuidv4(),
      firstName: 'C',
      lastName: 'Nguyen Van',
      email: 'nguyenvanc@gmail.com'
    }
  ],
  emailTokens: []
}

export const dataSignIn = {
  users: [
    {
      _id: uuidv4(),
      firstName: 'A',
      lastName: 'Nguyen Van',
      email: 'nguyenvana@gmail.com',
      password: '$2a$10$JfZQv2Yi1AzUfXb6Mi2OJOSBIDFyZxyQiRO8HaEhYbCG09agakOeC',
      blocked: false,
      verified: true
    },
    {
      _id: uuidv4(),
      firstName: 'B',
      lastName: 'Nguyen Van',
      email: 'nguyenvanb@gmail.com',
      password: '$2a$10$JfZQv2Yi1AzUfXb6Mi2OJOSBIDFyZxyQiRO8HaEhYbCG09agakOeC',
      blocked: true,
      verified: true
    },
    {
      _id: uuidv4(),
      firstName: 'C',
      lastName: 'Nguyen Van',
      email: 'nguyenvanc@gmail.com',
      password: '$2a$10$JfZQv2Yi1AzUfXb6Mi2OJOSBIDFyZxyQiRO8HaEhYbCG09agakOeC',
      blocked: false,
      verified: false
    }
  ]
}

export const dataSignOut = {
  loginSessions: [
    {
      _id: 'f77ab384-a14b-4cb5-8756-9dd550f06f15'
    },
    {
      _id: '3951714e-8637-4bca-8b66-e5942a4ff3ba'
    },
    {
      _id: 'b9d3ee30-3460-4b0b-9215-a17d84de9111'
    }
  ]
}
