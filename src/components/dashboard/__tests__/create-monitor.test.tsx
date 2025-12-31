import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateMonitorButton } from '../create-monitor'
import * as monitorActions from '~/app/actions/monitor'
import { toast } from 'sonner'

// Mock the server action
vi.mock('~/app/actions/monitor', () => ({
    createMonitor: vi.fn(),
}))

// Mock sonner
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))

describe('CreateMonitorButton', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('opens the dialog when clicked', async () => {
        render(<CreateMonitorButton />)
        const trigger = screen.getByRole('button', { name: /new monitor/i })
        fireEvent.click(trigger)
        expect(await screen.findByRole('dialog')).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Create Monitor' })).toBeInTheDocument()
    })

    it('validates required fields', () => {
        render(<CreateMonitorButton />)
        fireEvent.click(screen.getByRole('button', { name: /new monitor/i }))

        // Name is empty by default, button should be disabled
        const createBtn = screen.getByRole('button', { name: 'Create Monitor' })
        expect(createBtn).toBeDisabled()

        // Type name
        const nameInput = screen.getByLabelText(/friendly name/i)
        fireEvent.change(nameInput, { target: { value: 'My Monitor' } })

        expect(createBtn).not.toBeDisabled()
    })

    it('calls createMonitor with correct data', async () => {
        const createMonitorMock = vi.mocked(monitorActions.createMonitor)
        createMonitorMock.mockResolvedValue(undefined) // Success

        render(<CreateMonitorButton />)
        fireEvent.click(screen.getByRole('button', { name: /new monitor/i }))

        fireEvent.change(screen.getByLabelText(/friendly name/i), { target: { value: 'Test Monitor' } })
        fireEvent.change(screen.getByLabelText(/interval/i), { target: { value: '60' } })
        fireEvent.change(screen.getByLabelText(/secret/i), { target: { value: 'mysecret' } })

        fireEvent.click(screen.getByRole('button', { name: 'Create Monitor' }))

        await waitFor(() => {
            expect(createMonitorMock).toHaveBeenCalledWith({
                name: 'Test Monitor',
                interval: 60,
                gracePeriod: 5, // default
                smartGrace: false,
                secret: 'mysecret'
            })
        })

        expect(toast.success).toHaveBeenCalledWith('Monitor created successfully')
    })

    it('handles error during creation', async () => {
        const createMonitorMock = vi.mocked(monitorActions.createMonitor)
        createMonitorMock.mockRejectedValue(new Error('Failed'))

        render(<CreateMonitorButton />)
        fireEvent.click(screen.getByRole('button', { name: /new monitor/i }))

        fireEvent.change(screen.getByLabelText(/friendly name/i), { target: { value: 'Fail Monitor' } })
        fireEvent.click(screen.getByRole('button', { name: 'Create Monitor' }))

        await waitFor(() => {
            expect(createMonitorMock).toHaveBeenCalled()
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to create monitor')
    })
})
