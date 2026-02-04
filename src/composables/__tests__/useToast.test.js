import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useToast } from '../useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Clear all toasts between tests
    const { toasts } = useToast()
    toasts.value.length = 0
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with empty toasts', () => {
    const { toasts } = useToast()
    expect(toasts.value).toEqual([])
  })

  it('should add success toast', () => {
    const { success, toasts } = useToast()
    
    success('Test success message')
    
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].message).toBe('Test success message')
    expect(toasts.value[0].type).toBe('success')
  })

  it('should add error toast', () => {
    const { error, toasts } = useToast()
    
    error('Test error message')
    
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].message).toBe('Test error message')
    expect(toasts.value[0].type).toBe('error')
  })

  it('should add warning toast', () => {
    const { warning, toasts } = useToast()
    
    warning('Test warning message')
    
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].message).toBe('Test warning message')
    expect(toasts.value[0].type).toBe('warning')
  })

  it('should add info toast', () => {
    const { info, toasts } = useToast()
    
    info('Test info message')
    
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].message).toBe('Test info message')
    expect(toasts.value[0].type).toBe('info')
  })

  it('should remove toast by id', () => {
    const { addToast, removeToast, toasts } = useToast()
    
    const id = addToast('Test message')
    expect(toasts.value).toHaveLength(1)
    
    removeToast(id)
    expect(toasts.value).toHaveLength(0)
  })

  it('should auto-remove toast after duration', () => {
    const { success, toasts } = useToast()
    
    success('Test message', 3000)
    expect(toasts.value).toHaveLength(1)
    
    // Fast-forward time
    vi.advanceTimersByTime(3000)
    
    expect(toasts.value).toHaveLength(0)
  })

  it('should not auto-remove toast when duration is 0', () => {
    const { addToast, toasts } = useToast()
    
    addToast('Persistent message', 'info', 0)
    expect(toasts.value).toHaveLength(1)
    
    // Fast-forward time
    vi.advanceTimersByTime(10000)
    
    // Toast should still be there
    expect(toasts.value).toHaveLength(1)
  })

  it('should handle multiple toasts', () => {
    const { success, error, warning, toasts } = useToast()
    
    success('Success message')
    error('Error message')
    warning('Warning message')
    
    expect(toasts.value).toHaveLength(3)
    expect(toasts.value[0].type).toBe('success')
    expect(toasts.value[1].type).toBe('error')
    expect(toasts.value[2].type).toBe('warning')
  })

  it('should assign unique ids to toasts', () => {
    const { success, toasts } = useToast()
    
    success('Message 1')
    success('Message 2')
    success('Message 3')
    
    const ids = toasts.value.map(t => t.id)
    const uniqueIds = new Set(ids)
    
    expect(uniqueIds.size).toBe(3)
  })

  it('should use default duration of 3000ms', () => {
    const { success, toasts } = useToast()
    
    success('Test message')
    expect(toasts.value).toHaveLength(1)
    
    vi.advanceTimersByTime(2999)
    expect(toasts.value).toHaveLength(1)
    
    vi.advanceTimersByTime(1)
    expect(toasts.value).toHaveLength(0)
  })
})
