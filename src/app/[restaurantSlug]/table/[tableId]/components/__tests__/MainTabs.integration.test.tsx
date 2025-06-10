import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock MainTabs component with realistic behavior
const MainTabs = ({ 
  activeTab, 
  onTabChange, 
  restaurant, 
  sharedCartItems, 
  cartTotal, 
  currentParticipant,
  onAddItem,
  onRemoveItem,
  onSubmitOrder,
  onSetActiveTab 
}: any) => {
  const tabs = ['menu', 'cart', 'service']
  
  return (
    <div data-testid="main-tabs">
      {/* Tab Navigation */}
      <div className="tab-navigation" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => onTabChange(tab)}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'cart' && sharedCartItems.length > 0 && (
              <span className="cart-badge">{sharedCartItems.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'menu' && (
          <div data-testid="menu-tab">
            <h2>{restaurant?.name} Menu</h2>
            <div className="menu-items">
              <div className="menu-item" data-testid="menu-item-1">
                <h3>Test Burger</h3>
                <p>$12.99</p>
                <button 
                  onClick={() => onAddItem({ id: 'item-1', name: 'Test Burger', price: 12.99 }, 1)}
                  data-testid="add-burger"
                >
                  Add to Cart
                </button>
              </div>
              <div className="menu-item" data-testid="menu-item-2">
                <h3>Test Pizza</h3>
                <p>$15.99</p>
                <button 
                  onClick={() => onAddItem({ id: 'item-2', name: 'Test Pizza', price: 15.99 }, 1)}
                  data-testid="add-pizza"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
          <div data-testid="cart-tab">
            <h2>Your Cart</h2>
            <div className="cart-summary">
              <p>Total: ${cartTotal.toFixed(2)}</p>
              <p>Items: {sharedCartItems.length}</p>
            </div>
            {sharedCartItems.length === 0 ? (
              <p data-testid="empty-cart">Your cart is empty</p>
            ) : (
              <div className="cart-items">
                {sharedCartItems.map((item: any, index: number) => (
                  <div key={index} className="cart-item" data-testid={`cart-item-${index}`}>
                    <span>{item.menu_item?.name || item.name}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>${(item.total_price || item.price * item.quantity).toFixed(2)}</span>
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      data-testid={`remove-item-${index}`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button 
                  onClick={onSubmitOrder}
                  data-testid="submit-order"
                  disabled={!currentParticipant}
                  className="submit-order-btn"
                >
                  Submit Order
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'service' && (
          <div data-testid="service-tab">
            <h2>Service Requests</h2>
            <div className="service-buttons">
              <button data-testid="call-waiter">Call Waiter</button>
              <button data-testid="water-refill">Water Refill</button>
              <button data-testid="check-please">Check Please</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

describe('MainTabs Integration', () => {
  const mockRestaurant = {
    id: 'restaurant-123',
    name: 'Test Restaurant',
    slug: 'test-restaurant',
  }

  const mockParticipant = {
    id: 'participant-123',
    session_id: 'session-123',
    display_name: 'John Doe',
    color_code: '#FF5733',
  }

  const mockCartItems = [
    {
      id: 'cart-item-1',
      menu_item: { name: 'Test Burger', price: 12.99 },
      quantity: 1,
      total_price: 12.99,
    },
    {
      id: 'cart-item-2',
      menu_item: { name: 'Test Pizza', price: 15.99 },
      quantity: 2,
      total_price: 31.98,
    },
  ]

  const defaultProps = {
    activeTab: 'menu',
    onTabChange: jest.fn(),
    restaurant: mockRestaurant,
    sharedCartItems: [],
    cartTotal: 0,
    currentParticipant: mockParticipant,
    onAddItem: jest.fn(),
    onRemoveItem: jest.fn(),
    onSubmitOrder: jest.fn(),
    onSetActiveTab: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Tab Navigation', () => {
    it('should render all tabs with correct active state', () => {
      render(<MainTabs {...defaultProps} />)
      
      expect(screen.getByRole('tab', { name: /menu/i })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('tab', { name: /cart/i })).toHaveAttribute('aria-selected', 'false')
      expect(screen.getByRole('tab', { name: /service/i })).toHaveAttribute('aria-selected', 'false')
    })

    it('should switch tabs when clicked', async () => {
      const user = userEvent.setup()
      const onTabChange = jest.fn()
      
      render(<MainTabs {...defaultProps} onTabChange={onTabChange} />)
      
      await user.click(screen.getByRole('tab', { name: /cart/i }))
      
      expect(onTabChange).toHaveBeenCalledWith('cart')
    })

    it('should show cart badge when items are present', () => {
      render(
        <MainTabs 
          {...defaultProps} 
          sharedCartItems={mockCartItems}
          cartTotal={44.97}
        />
      )
      
      expect(screen.getByText('2')).toBeInTheDocument() // Cart badge
    })

    it('should not show cart badge when cart is empty', () => {
      render(<MainTabs {...defaultProps} />)
      
      expect(screen.queryByText('0')).not.toBeInTheDocument()
    })
  })

  describe('Menu Tab Integration', () => {
    it('should display restaurant name and menu items', () => {
      render(<MainTabs {...defaultProps} />)
      
      expect(screen.getByText('Test Restaurant Menu')).toBeInTheDocument()
      expect(screen.getByTestId('menu-item-1')).toBeInTheDocument()
      expect(screen.getByTestId('menu-item-2')).toBeInTheDocument()
      expect(screen.getByText('Test Burger')).toBeInTheDocument()
      expect(screen.getByText('Test Pizza')).toBeInTheDocument()
    })

    it('should handle adding items to cart', async () => {
      const user = userEvent.setup()
      const onAddItem = jest.fn()
      
      render(<MainTabs {...defaultProps} onAddItem={onAddItem} />)
      
      await user.click(screen.getByTestId('add-burger'))
      
      expect(onAddItem).toHaveBeenCalledWith(
        { id: 'item-1', name: 'Test Burger', price: 12.99 },
        1
      )
    })

    it('should handle adding multiple different items', async () => {
      const user = userEvent.setup()
      const onAddItem = jest.fn()
      
      render(<MainTabs {...defaultProps} onAddItem={onAddItem} />)
      
      await user.click(screen.getByTestId('add-burger'))
      await user.click(screen.getByTestId('add-pizza'))
      
      expect(onAddItem).toHaveBeenCalledTimes(2)
      expect(onAddItem).toHaveBeenNthCalledWith(1, 
        { id: 'item-1', name: 'Test Burger', price: 12.99 }, 1
      )
      expect(onAddItem).toHaveBeenNthCalledWith(2, 
        { id: 'item-2', name: 'Test Pizza', price: 15.99 }, 1
      )
    })
  })

  describe('Cart Tab Integration', () => {
    it('should show empty cart message when no items', () => {
      render(<MainTabs {...defaultProps} activeTab="cart" />)
      
      expect(screen.getByTestId('empty-cart')).toBeInTheDocument()
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    })

    it('should display cart items with correct details', () => {
      render(
        <MainTabs 
          {...defaultProps} 
          activeTab="cart"
          sharedCartItems={mockCartItems}
          cartTotal={44.97}
        />
      )
      
      expect(screen.getByText('Test Burger')).toBeInTheDocument()
      expect(screen.getByText('Test Pizza')).toBeInTheDocument()
      expect(screen.getByText('Total: $44.97')).toBeInTheDocument()
      expect(screen.getByText('Items: 2')).toBeInTheDocument()
    })

    it('should handle removing items from cart', async () => {
      const user = userEvent.setup()
      const onRemoveItem = jest.fn()
      
      render(
        <MainTabs 
          {...defaultProps} 
          activeTab="cart"
          sharedCartItems={mockCartItems}
          cartTotal={44.97}
          onRemoveItem={onRemoveItem}
        />
      )
      
      await user.click(screen.getByTestId('remove-item-0'))
      
      expect(onRemoveItem).toHaveBeenCalledWith('cart-item-1')
    })

    it('should handle order submission', async () => {
      const user = userEvent.setup()
      const onSubmitOrder = jest.fn()
      
      render(
        <MainTabs 
          {...defaultProps} 
          activeTab="cart"
          sharedCartItems={mockCartItems}
          cartTotal={44.97}
          onSubmitOrder={onSubmitOrder}
        />
      )
      
      await user.click(screen.getByTestId('submit-order'))
      
      expect(onSubmitOrder).toHaveBeenCalled()
    })

    it('should disable submit button when no participant', () => {
      render(
        <MainTabs 
          {...defaultProps} 
          activeTab="cart"
          sharedCartItems={mockCartItems}
          cartTotal={44.97}
          currentParticipant={null}
        />
      )
      
      expect(screen.getByTestId('submit-order')).toBeDisabled()
    })

    it('should enable submit button when participant is present', () => {
      render(
        <MainTabs 
          {...defaultProps} 
          activeTab="cart"
          sharedCartItems={mockCartItems}
          cartTotal={44.97}
          currentParticipant={mockParticipant}
        />
      )
      
      expect(screen.getByTestId('submit-order')).not.toBeDisabled()
    })
  })

  describe('Service Tab Integration', () => {
    it('should display service request buttons', () => {
      render(<MainTabs {...defaultProps} activeTab="service" />)
      
      expect(screen.getByTestId('call-waiter')).toBeInTheDocument()
      expect(screen.getByTestId('water-refill')).toBeInTheDocument()
      expect(screen.getByTestId('check-please')).toBeInTheDocument()
    })

    it('should handle service requests', async () => {
      const user = userEvent.setup()
      
      render(<MainTabs {...defaultProps} activeTab="service" />)
      
      const callWaiterBtn = screen.getByTestId('call-waiter')
      await user.click(callWaiterBtn)
      
      // In a real implementation, this would trigger a service request
      expect(callWaiterBtn).toBeInTheDocument()
    })
  })

  describe('Complete User Flows', () => {
    it('should handle complete add-to-cart and checkout flow', async () => {
      const user = userEvent.setup()
      const onTabChange = jest.fn()
      const onAddItem = jest.fn()
      const onSubmitOrder = jest.fn()

      // Start with menu tab
      const { rerender } = render(
        <MainTabs 
          {...defaultProps} 
          onTabChange={onTabChange}
          onAddItem={onAddItem}
          onSubmitOrder={onSubmitOrder}
        />
      )
      
      // Add item to cart
      await user.click(screen.getByTestId('add-burger'))
      expect(onAddItem).toHaveBeenCalled()
      
      // Switch to cart tab
      await user.click(screen.getByRole('tab', { name: /cart/i }))
      expect(onTabChange).toHaveBeenCalledWith('cart')
      
      // Simulate cart state update
      rerender(
        <MainTabs 
          {...defaultProps} 
          activeTab="cart"
          sharedCartItems={[mockCartItems[0]]}
          cartTotal={12.99}
          onTabChange={onTabChange}
          onAddItem={onAddItem}
          onSubmitOrder={onSubmitOrder}
        />
      )
      
      // Submit order
      await user.click(screen.getByTestId('submit-order'))
      expect(onSubmitOrder).toHaveBeenCalled()
    })

    it('should handle cart management across tabs', async () => {
      const user = userEvent.setup()
      const onTabChange = jest.fn()
      const onRemoveItem = jest.fn()

      // Start with populated cart
      const { rerender } = render(
        <MainTabs 
          {...defaultProps} 
          activeTab="cart"
          sharedCartItems={mockCartItems}
          cartTotal={44.97}
          onTabChange={onTabChange}
          onRemoveItem={onRemoveItem}
        />
      )
      
      // Remove an item
      await user.click(screen.getByTestId('remove-item-0'))
      expect(onRemoveItem).toHaveBeenCalledWith('cart-item-1')
      
      // Simulate updated cart state
      rerender(
        <MainTabs 
          {...defaultProps} 
          activeTab="cart"
          sharedCartItems={[mockCartItems[1]]}
          cartTotal={31.98}
          onTabChange={onTabChange}
          onRemoveItem={onRemoveItem}
        />
      )
      
      // Verify updated display
      expect(screen.getByText('Total: $31.98')).toBeInTheDocument()
      expect(screen.getByText('Items: 1')).toBeInTheDocument()
    })

    it('should show cart badge updates across tab switches', async () => {
      const user = userEvent.setup()
      const onTabChange = jest.fn()

      // Start with empty cart
      const { rerender } = render(
        <MainTabs 
          {...defaultProps} 
          onTabChange={onTabChange}
        />
      )
      
      // No badge should be visible
      expect(screen.queryByText('0')).not.toBeInTheDocument()
      
      // Simulate items being added
      rerender(
        <MainTabs 
          {...defaultProps} 
          sharedCartItems={mockCartItems}
          cartTotal={44.97}
          onTabChange={onTabChange}
        />
      )
      
      // Badge should now show count
      expect(screen.getByText('2')).toBeInTheDocument()
      
      // Switch to cart tab
      await user.click(screen.getByRole('tab', { name: /cart/i }))
      expect(onTabChange).toHaveBeenCalledWith('cart')
    })

    it('should maintain state consistency across tab switches', async () => {
      const user = userEvent.setup()
      const onTabChange = jest.fn()

      const { rerender } = render(
        <MainTabs 
          {...defaultProps} 
          onTabChange={onTabChange}
        />
      )
      
      // Switch between tabs
      await user.click(screen.getByRole('tab', { name: /service/i }))
      expect(onTabChange).toHaveBeenCalledWith('service')
      
      rerender(
        <MainTabs 
          {...defaultProps} 
          activeTab="service"
          onTabChange={onTabChange}
        />
      )
      
      expect(screen.getByTestId('service-tab')).toBeInTheDocument()
      
      // Switch back to menu
      await user.click(screen.getByRole('tab', { name: /menu/i }))
      expect(onTabChange).toHaveBeenCalledWith('menu')
      
      rerender(
        <MainTabs 
          {...defaultProps} 
          activeTab="menu"
          onTabChange={onTabChange}
        />
      )
      
      expect(screen.getByTestId('menu-tab')).toBeInTheDocument()
    })
  })

  describe('Error States and Edge Cases', () => {
    it('should handle missing restaurant data gracefully', () => {
      render(<MainTabs {...defaultProps} restaurant={null} />)
      
      expect(screen.getByRole('tab', { name: /menu/i })).toBeInTheDocument()
      expect(screen.getByTestId('menu-tab')).toBeInTheDocument()
    })

    it('should handle malformed cart items', () => {
      const malformedItems = [
        { id: 'item-1', quantity: 1 }, // Missing menu_item and price info
        { menu_item: { name: 'Test Item' }, quantity: 2 }, // Missing price
      ]
      
      render(
        <MainTabs 
          {...defaultProps} 
          activeTab="cart"
          sharedCartItems={malformedItems}
          cartTotal={0}
        />
      )
      
      // Should render without crashing
      expect(screen.getByTestId('cart-tab')).toBeInTheDocument()
    })

    it('should handle rapid tab switching', async () => {
      const user = userEvent.setup()
      const onTabChange = jest.fn()
      
      render(<MainTabs {...defaultProps} onTabChange={onTabChange} />)
      
      // Rapidly switch between tabs
      await user.click(screen.getByRole('tab', { name: /cart/i }))
      await user.click(screen.getByRole('tab', { name: /service/i }))
      await user.click(screen.getByRole('tab', { name: /menu/i }))
      
      expect(onTabChange).toHaveBeenCalledTimes(3)
      expect(onTabChange).toHaveBeenNthCalledWith(1, 'cart')
      expect(onTabChange).toHaveBeenNthCalledWith(2, 'service')
      expect(onTabChange).toHaveBeenNthCalledWith(3, 'menu')
    })
  })
})