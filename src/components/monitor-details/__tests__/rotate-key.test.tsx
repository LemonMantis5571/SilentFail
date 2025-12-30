import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RotateKeyButton } from '../rotate-key-button'
import * as monitorActions from '~/app/actions/monitor'
import { toast } from 'sonner'

// Mock server action
vi.mock('~/app/actions/monitor', () => ({
    rotateMonitorKey: vi.fn(),
}))

// Mock sonner
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))

describe('RotateKeyButton', () => {
    const monitorId = '123'

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('shows confirmation dialog', async () => {
        const user = userEvent.setup()
        render(<RotateKeyButton monitorId={monitorId} />)

        // Click button
        await user.click(screen.getByRole('button', { name: /regenerate key/i }))

        // Check dialog
        expect(await screen.findByRole('alertdialog')).toBeInTheDocument()
        expect(screen.getByText(/regenerate monitor key\?/i)).toBeInTheDocument()
    })

    it('calls rotateMonitorKey when confirmed', async () => {
        const user = userEvent.setup()
        const rotateMock = vi.mocked(monitorActions.rotateMonitorKey)
        rotateMock.mockResolvedValue({} as any)

        render(<RotateKeyButton monitorId={monitorId} />)

        await user.click(screen.getByRole('button', { name: /regenerate key/i }))

        // Confirm
        await user.click(screen.getByRole('button', { name: /yes, regenerate it/i }))

        await waitFor(() => {
            expect(rotateMock).toHaveBeenCalledWith(monitorId)
        })

        expect(toast.success).toHaveBeenCalledWith('Monitor key regenerated successfully')
    })
})
