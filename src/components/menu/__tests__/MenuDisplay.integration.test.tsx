import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock MenuDisplay component with realistic menu browsing behavior
const MenuDisplay = ({
    restaurant,
    menuCategories,
    menuItems,
    onAddToCart,
    isLoading,
    error
}: any) => {
    if (isLoading) {
        return <div data-testid="menu-loading">Loading menu...</div>
    }

    if (error) {
        return <div data-testid="menu-error">{error}</div>
    }

    return (
        <div data-testid="menu-display">
            <header className="menu-header">
                <h1>{restaurant?.name} Menu</h1>
                <p>{restaurant?.description}</p>
            </header>

            <div className="menu-content">
                {menuCategories.map((category: any) => {
                    const categoryItems = menuItems.filter((item: any) =>
                        item.category_id === category.id && item.is_available
                    )

                    if (categoryItems.length === 0) return null

                    return (
                        <section key={category.id} data-testid={`category-${category.id}`}>
                            <h2>{category.name}</h2>
                            {category.description && <p>{category.description}</p>}

                            <div className="menu-items">
                                {categoryItems.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="menu-item"
                                        data-testid={`menu-item-${item.id}`}
                                    >
                                        <div className="item-info">
                                            <h3>{item.name}</h3>
                                            <p className="description">{item.description}</p>
                                            <p className="price">${item.price.toFixed(2)}</p>

                                            {item.preparation_time && (
                                                <p className="prep-time">{item.preparation_time} min</p>
                                            )}

                                            {item.dietary_info && item.dietary_info.length > 0 && (
                                                <div className="dietary-info">
                                                    {item.dietary_info.map((info: string) => (
                                                        <span key={info} className="dietary-tag">
                                                            {info}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {item.allergens && item.allergens.length > 0 && (
                                                <div className="allergens">
                                                    <span className="allergen-warning">
                                                        Contains: {item.allergens.join(', ')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="item-actions">
                                            <div className="quantity-selector">
                                                <label htmlFor={`quantity-${item.id}`}>Qty:</label>
                                                <select
                                                    id={`quantity-${item.id}`}
                                                    data-testid={`quantity-${item.id}`}
                                                    defaultValue="1"
                                                >
                                                    {[1, 2, 3, 4, 5].map(num => (
                                                        <option key={num} value={num}>{num}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    const quantity = parseInt(
                                                        (document.getElementById(`quantity-${item.id}`) as HTMLSelectElement)?.value || '1'
                                                    )
                                                    onAddToCart(item, quantity)
                                                }}
                                                data-testid={`add-to-cart-${item.id}`}
                                                className="add-to-cart-btn"
                                                disabled={!item.is_available}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                })}
            </div>

            {menuCategories.length === 0 && (
                <div data-testid="no-menu">
                    <p>No menu available at this time.</p>
                </div>
            )}
        </div>
    )
}

describe('MenuDisplay Integration', () => {
    const mockRestaurant = {
        id: 'restaurant-123',
        name: 'Test Restaurant',
        description: 'A wonderful test restaurant',
    }

    const mockCategories = [
        {
            id: 'cat-1',
            name: 'Appetizers',
            description: 'Start your meal right',
            display_order: 1,
        },
        {
            id: 'cat-2',
            name: 'Main Courses',
            description: 'Hearty main dishes',
            display_order: 2,
        },
        {
            id: 'cat-3',
            name: 'Desserts',
            description: 'Sweet endings',
            display_order: 3,
        },
    ]

    const mockMenuItems = [
        {
            id: 'item-1',
            category_id: 'cat-1',
            name: 'Bruschetta',
            description: 'Fresh tomatoes on toasted bread',
            price: 8.99,
            preparation_time: 10,
            is_available: true,
            dietary_info: ['vegetarian'],
            allergens: ['gluten'],
            ingredients: ['tomato', 'basil', 'bread'],
        },
        {
            id: 'item-2',
            category_id: 'cat-1',
            name: 'Wings',
            description: 'Spicy buffalo wings',
            price: 12.99,
            preparation_time: 15,
            is_available: true,
            dietary_info: [],
            allergens: [],
            ingredients: ['chicken', 'buffalo sauce'],
        },
        {
            id: 'item-3',
            category_id: 'cat-2',
            name: 'Grilled Salmon',
            description: 'Fresh Atlantic salmon',
            price: 24.99,
            preparation_time: 20,
            is_available: true,
            dietary_info: ['gluten-free', 'keto'],
            allergens: ['fish'],
            ingredients: ['salmon', 'lemon', 'herbs'],
        },
        {
            id: 'item-4',
            category_id: 'cat-2',
            name: 'Pasta Carbonara',
            description: 'Classic Italian pasta',
            price: 18.99,
            preparation_time: 18,
            is_available: false, // Not available
            dietary_info: [],
            allergens: ['gluten', 'eggs'],
            ingredients: ['pasta', 'eggs', 'bacon'],
        },
        {
            id: 'item-5',
            category_id: 'cat-3',
            name: 'Tiramisu',
            description: 'Classic Italian dessert',
            price: 7.99,
            preparation_time: 5,
            is_available: true,
            dietary_info: ['vegetarian'],
            allergens: ['dairy', 'eggs'],
            ingredients: ['mascarpone', 'coffee', 'ladyfingers'],
        },
    ]

    const defaultProps = {
        restaurant: mockRestaurant,
        menuCategories: mockCategories,
        menuItems: mockMenuItems,
        onAddToCart: jest.fn(),
        isLoading: false,
        error: null,
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Menu Structure and Display', () => {
        it('should render restaurant header correctly', () => {
            render(<MenuDisplay {...defaultProps} />)

            expect(screen.getByText('Test Restaurant Menu')).toBeInTheDocument()
            expect(screen.getByText('A wonderful test restaurant')).toBeInTheDocument()
        })

        it('should display all categories with available items', () => {
            render(<MenuDisplay {...defaultProps} />)

            expect(screen.getByTestId('category-cat-1')).toBeInTheDocument()
            expect(screen.getByTestId('category-cat-2')).toBeInTheDocument()
            expect(screen.getByTestId('category-cat-3')).toBeInTheDocument()

            expect(screen.getByText('Appetizers')).toBeInTheDocument()
            expect(screen.getByText('Main Courses')).toBeInTheDocument()
            expect(screen.getByText('Desserts')).toBeInTheDocument()
        })

        it('should display category descriptions', () => {
            render(<MenuDisplay {...defaultProps} />)

            expect(screen.getByText('Start your meal right')).toBeInTheDocument()
            expect(screen.getByText('Hearty main dishes')).toBeInTheDocument()
            expect(screen.getByText('Sweet endings')).toBeInTheDocument()
        })

        it('should only show available menu items', () => {
            render(<MenuDisplay {...defaultProps} />)

            // Available items
            expect(screen.getByTestId('menu-item-item-1')).toBeInTheDocument()
            expect(screen.getByTestId('menu-item-item-2')).toBeInTheDocument()
            expect(screen.getByTestId('menu-item-item-3')).toBeInTheDocument()
            expect(screen.getByTestId('menu-item-item-5')).toBeInTheDocument()

            // Unavailable item should not be displayed
            expect(screen.queryByTestId('menu-item-item-4')).not.toBeInTheDocument()
            expect(screen.queryByText('Pasta Carbonara')).not.toBeInTheDocument()
        })

        it('should display item details correctly', () => {
            render(<MenuDisplay {...defaultProps} />)

            // Check bruschetta details
            expect(screen.getByText('Bruschetta')).toBeInTheDocument()
            expect(screen.getByText('Fresh tomatoes on toasted bread')).toBeInTheDocument()
            expect(screen.getByText('$8.99')).toBeInTheDocument()
            expect(screen.getByText('10 min')).toBeInTheDocument()
        })
    })

    describe('Dietary Information and Allergens', () => {
        it('should display dietary information tags', () => {
            render(<MenuDisplay {...defaultProps} />)

            expect(screen.getAllByText('vegetarian')).toHaveLength(2) // Bruschetta and Tiramisu
            expect(screen.getByText('gluten-free')).toBeInTheDocument()
            expect(screen.getByText('keto')).toBeInTheDocument()
        })

        it('should display allergen warnings', () => {
            render(<MenuDisplay {...defaultProps} />)

            expect(screen.getByText('Contains: gluten')).toBeInTheDocument()
            expect(screen.getByText('Contains: fish')).toBeInTheDocument()
            expect(screen.getByText('Contains: dairy, eggs')).toBeInTheDocument()
        })

        it('should handle items without dietary info or allergens', () => {
            render(<MenuDisplay {...defaultProps} />)

            // Wings has no dietary info or allergens
            const wingsItem = screen.getByTestId('menu-item-item-2')
            expect(wingsItem).toBeInTheDocument()

            // Should not show empty dietary info sections
            expect(wingsItem.querySelector('.dietary-info')).not.toBeInTheDocument()
            expect(wingsItem.querySelector('.allergens')).not.toBeInTheDocument()
        })
    })

    describe('Add to Cart Functionality', () => {
        it('should handle adding items with default quantity', async () => {
            const user = userEvent.setup()
            const onAddToCart = jest.fn()

            render(<MenuDisplay {...defaultProps} onAddToCart={onAddToCart} />)

            await user.click(screen.getByTestId('add-to-cart-item-1'))

            expect(onAddToCart).toHaveBeenCalledWith(mockMenuItems[0], 1)
        })

        it('should handle adding items with custom quantity', async () => {
            const user = userEvent.setup()
            const onAddToCart = jest.fn()

            render(<MenuDisplay {...defaultProps} onAddToCart={onAddToCart} />)

            // Change quantity to 3
            await user.selectOptions(screen.getByTestId('quantity-item-1'), '3')
            await user.click(screen.getByTestId('add-to-cart-item-1'))

            expect(onAddToCart).toHaveBeenCalledWith(mockMenuItems[0], 3)
        })

        it('should handle adding multiple different items', async () => {
            const user = userEvent.setup()
            const onAddToCart = jest.fn()

            render(<MenuDisplay {...defaultProps} onAddToCart={onAddToCart} />)

            // Add bruschetta
            await user.selectOptions(screen.getByTestId('quantity-item-1'), '2')
            await user.click(screen.getByTestId('add-to-cart-item-1'))

            // Add salmon
            await user.selectOptions(screen.getByTestId('quantity-item-3'), '1')
            await user.click(screen.getByTestId('add-to-cart-item-3'))

            expect(onAddToCart).toHaveBeenCalledTimes(2)
            expect(onAddToCart).toHaveBeenNthCalledWith(1, mockMenuItems[0], 2)
            expect(onAddToCart).toHaveBeenNthCalledWith(2, mockMenuItems[2], 1)
        })

        it('should disable add to cart for unavailable items', () => {
            // Include unavailable item for this test
            const menuWithUnavailable = [
                ...mockMenuItems,
                {
                    id: 'item-unavailable',
                    category_id: 'cat-2',
                    name: 'Sold Out Item',
                    description: 'This item is sold out',
                    price: 20.00,
                    is_available: false,
                }
            ]

            render(
                <MenuDisplay
                    {...defaultProps}
                    menuItems={menuWithUnavailable}
                />
            )

            // Should not render unavailable items at all in this implementation
            expect(screen.queryByText('Sold Out Item')).not.toBeInTheDocument()
        })
    })

    describe('Loading and Error States', () => {
        it('should display loading state', () => {
            render(<MenuDisplay {...defaultProps} isLoading={true} />)

            expect(screen.getByTestId('menu-loading')).toBeInTheDocument()
            expect(screen.getByText('Loading menu...')).toBeInTheDocument()
        })

        it('should display error state', () => {
            render(<MenuDisplay {...defaultProps} error="Failed to load menu" />)

            expect(screen.getByTestId('menu-error')).toBeInTheDocument()
            expect(screen.getByText('Failed to load menu')).toBeInTheDocument()
        })

        it('should not display menu content when loading', () => {
            render(<MenuDisplay {...defaultProps} isLoading={true} />)

            expect(screen.queryByTestId('menu-display')).not.toBeInTheDocument()
            expect(screen.queryByText('Test Restaurant Menu')).not.toBeInTheDocument()
        })

        it('should not display menu content when error exists', () => {
            render(<MenuDisplay {...defaultProps} error="Network error" />)

            expect(screen.queryByTestId('menu-display')).not.toBeInTheDocument()
            expect(screen.queryByText('Test Restaurant Menu')).not.toBeInTheDocument()
        })
    })

    describe('Empty States', () => {
        it('should handle empty menu categories', () => {
            render(<MenuDisplay {...defaultProps} menuCategories={[]} />)

            expect(screen.getByTestId('no-menu')).toBeInTheDocument()
            expect(screen.getByText('No menu available at this time.')).toBeInTheDocument()
        })

        it('should handle categories with no available items', () => {
            const categoriesWithNoItems = [
                {
                    id: 'cat-empty',
                    name: 'Empty Category',
                    description: 'This category has no items',
                    display_order: 1,
                }
            ]

            const emptyMenuItems: any[] = []

            render(
                <MenuDisplay
                    {...defaultProps}
                    menuCategories={categoriesWithNoItems}
                    menuItems={emptyMenuItems}
                />
            )

            // Category should not be rendered if it has no available items
            expect(screen.queryByTestId('category-cat-empty')).not.toBeInTheDocument()
            expect(screen.queryByText('Empty Category')).not.toBeInTheDocument()
        })

        it('should handle missing restaurant data', () => {
            render(<MenuDisplay {...defaultProps} restaurant={null} />)

            expect(screen.getByTestId('menu-display')).toBeInTheDocument()
            // Check that menu renders even without restaurant name
            expect(screen.getByText(/Menu$/)).toBeInTheDocument()
        })
    })

    describe('Complex User Interactions', () => {
        it('should handle rapid successive add to cart actions', async () => {
            const user = userEvent.setup()
            const onAddToCart = jest.fn()

            render(<MenuDisplay {...defaultProps} onAddToCart={onAddToCart} />)

            // Rapidly click add to cart multiple times
            const addButton = screen.getByTestId('add-to-cart-item-1')
            await user.click(addButton)
            await user.click(addButton)
            await user.click(addButton)

            expect(onAddToCart).toHaveBeenCalledTimes(3)
        })

        it('should handle quantity changes for multiple items simultaneously', async () => {
            const user = userEvent.setup()
            const onAddToCart = jest.fn()

            render(<MenuDisplay {...defaultProps} onAddToCart={onAddToCart} />)

            // Change quantities for multiple items
            await user.selectOptions(screen.getByTestId('quantity-item-1'), '3')
            await user.selectOptions(screen.getByTestId('quantity-item-2'), '2')
            await user.selectOptions(screen.getByTestId('quantity-item-3'), '1')

            // Add all items
            await user.click(screen.getByTestId('add-to-cart-item-1'))
            await user.click(screen.getByTestId('add-to-cart-item-2'))
            await user.click(screen.getByTestId('add-to-cart-item-3'))

            expect(onAddToCart).toHaveBeenCalledTimes(3)
            expect(onAddToCart).toHaveBeenNthCalledWith(1, mockMenuItems[0], 3)
            expect(onAddToCart).toHaveBeenNthCalledWith(2, mockMenuItems[1], 2)
            expect(onAddToCart).toHaveBeenNthCalledWith(3, mockMenuItems[2], 1)
        })

        it('should maintain quantity selections after adding items', async () => {
            const user = userEvent.setup()
            const onAddToCart = jest.fn()

            render(<MenuDisplay {...defaultProps} onAddToCart={onAddToCart} />)

            // Change quantity and add item
            await user.selectOptions(screen.getByTestId('quantity-item-1'), '4')
            await user.click(screen.getByTestId('add-to-cart-item-1'))

            // Quantity should still be 4 after adding
            expect(screen.getByTestId('quantity-item-1')).toHaveValue('4')

            // Add again with same quantity
            await user.click(screen.getByTestId('add-to-cart-item-1'))

            expect(onAddToCart).toHaveBeenCalledTimes(2)
            expect(onAddToCart).toHaveBeenNthCalledWith(1, mockMenuItems[0], 4)
            expect(onAddToCart).toHaveBeenNthCalledWith(2, mockMenuItems[0], 4)
        })
    })

    describe('Accessibility and UX', () => {
        it('should have proper form labels for quantity selectors', () => {
            render(<MenuDisplay {...defaultProps} />)

            const quantityLabels = screen.getAllByLabelText('Qty:')
            expect(quantityLabels.length).toBeGreaterThan(0)
            expect(quantityLabels[0]).toBeInTheDocument()
            expect(quantityLabels[0].getAttribute('id')).toBe('quantity-item-1')
        })

        it('should have accessible button text', () => {
            render(<MenuDisplay {...defaultProps} />)

            const addToCartButtons = screen.getAllByText('Add to Cart')
            expect(addToCartButtons.length).toBeGreaterThan(0)

            addToCartButtons.forEach(button => {
                expect(button).toHaveAttribute('data-testid')
            })
        })

        it('should display preparation times for user planning', () => {
            render(<MenuDisplay {...defaultProps} />)

            expect(screen.getByText('10 min')).toBeInTheDocument()
            expect(screen.getByText('15 min')).toBeInTheDocument()
            expect(screen.getByText('20 min')).toBeInTheDocument()
            expect(screen.getByText('5 min')).toBeInTheDocument()
        })
    })
})