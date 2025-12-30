import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteMonitorItem } from '../delete-monitor-item'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import * as monitorActions from '~/app/actions/monitor'

// Mock the server action
vi.mock('~/app/actions/monitor', () => ({
    deleteMonitor: vi.fn(),
}))

describe('DeleteMonitorItem', () => {
    const mockProps = {
        id: '123',
        name: 'Test Monitor'
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    const renderComponent = () => {
        return render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DeleteMonitorItem {...mockProps} />
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    it('shows alert dialog when delete is clicked', async () => {
        const user = userEvent.setup()
        renderComponent()

        // Open the menu
        await user.click(screen.getByRole('button', { name: /open menu/i }))

        // Find DELETE
        const deleteItem = await screen.findByText('Delete')

        // Click DELETE
        await user.click(deleteItem)

        // Expect alert dialog
        expect(await screen.findByRole('alertdialog')).toBeInTheDocument()
        expect(screen.getByText(/are you absolutely sure/i)).toBeInTheDocument()
    })

    it('calls deleteMonitor when confirmed', async () => {
        const user = userEvent.setup()
        const deleteMonitorMock = vi.mocked(monitorActions.deleteMonitor)
        deleteMonitorMock.mockResolvedValue(undefined)

        renderComponent()

        // Open menu
        await user.click(screen.getByRole('button', { name: /open menu/i }))

        // Click delete
        await user.click(await screen.findByText('Delete'))

        // Click confirm in alert dialog
        const confirmBtn = screen.getByRole('button', { name: 'Delete Monitor' })
        await user.click(confirmBtn)

        await waitFor(() => {
            expect(deleteMonitorMock).toHaveBeenCalledWith(mockProps.id)
        })
    })

    it('handles cancellation', async () => {
        const user = userEvent.setup()
        renderComponent()

        // Open menu and click delete
        await user.click(screen.getByRole('button', { name: /open menu/i }))
        await user.click(await screen.findByText('Delete'))

        // Click cancel
        const cancelBtn = screen.getByRole('button', { name: 'Cancel' })
        await user.click(cancelBtn)

        // Alert dialog should disappear
        await waitFor(() => {
            expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
        })
    })
})
