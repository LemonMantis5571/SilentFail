import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditMonitorModal } from '../edit-monitor-modal'
import * as monitorActions from '~/app/actions/monitor'
import { toast } from 'sonner'

vi.mock('~/app/actions/monitor', () => ({
    updateMonitor: vi.fn(),
}))


vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))

describe('EditMonitorModal', () => {
    const mockMonitor = {
        id: '123',
        name: 'My Monitor',
        interval: 30,
        gracePeriod: 2,
        useSmartGrace: true,
        secret: 'initial-secret'
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('pre-fills form with monitor data', async () => {
        const user = userEvent.setup()
        render(<EditMonitorModal monitor={mockMonitor} />)


        await user.click(screen.getByRole('button', { name: /edit/i }))


        expect(screen.getByLabelText(/friendly name/i)).toHaveValue('My Monitor')
        expect(screen.getByLabelText(/interval/i)).toHaveValue(30)
        expect(screen.getByLabelText(/grace period/i)).toHaveValue(2)
        expect(screen.getByLabelText(/secret/i)).toHaveValue('initial-secret')
    })

    it('calls updateMonitor with new data', async () => {
        const user = userEvent.setup()
        const updateMonitorMock = vi.mocked(monitorActions.updateMonitor)
        updateMonitorMock.mockResolvedValue()

        render(<EditMonitorModal monitor={mockMonitor} />)

        // Open modal
        await user.click(screen.getByRole('button', { name: /edit/i }))


        const nameInput = screen.getByLabelText(/friendly name/i)
        await user.clear(nameInput)
        await user.type(nameInput, 'Updated Name')

        const intervalInput = screen.getByLabelText(/interval/i)
        await user.clear(intervalInput)
        await user.type(intervalInput, '60')

        const secretInput = screen.getByLabelText(/secret/i)
        await user.clear(secretInput)
        await user.type(secretInput, 'new-secret')


        await user.click(screen.getByRole('button', { name: /save changes/i }))

        await waitFor(() => {
            expect(updateMonitorMock).toHaveBeenCalledWith(mockMonitor.id, {
                name: 'Updated Name',
                interval: 60,
                gracePeriod: 2,
                smartGrace: true,
                secret: 'new-secret'
            })
        })

        expect(toast.success).toHaveBeenCalledWith('Monitor updated successfully')
    })
})
