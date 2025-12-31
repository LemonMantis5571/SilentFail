import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { IntegrationsModal } from '../integration-modal'
import { toast } from 'sonner'

// Mock sonner
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))

// Mock clipboard
const writeTextMock = vi.fn().mockResolvedValue(undefined)
Object.assign(navigator, {
    clipboard: {
        writeText: writeTextMock,
    },
})

describe('IntegrationsModal', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('opens the dialog and shows curl by default', async () => {
        render(<IntegrationsModal monitorKey="test-key" />)
        const trigger = screen.getByRole('button', { name: /integrations/i })
        fireEvent.click(trigger)

        expect(await screen.findByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText('Integration Snippets')).toBeInTheDocument()

        // Check for curl snippet
        expect(screen.getByText(/curl.*test-key/)).toBeInTheDocument()
    })

    it('switches tabs', async () => {
        render(<IntegrationsModal monitorKey="test-key" />)
        fireEvent.click(screen.getByRole('button', { name: /integrations/i }))

        // Switch to Python
        fireEvent.click(screen.getByRole('button', { name: 'python' }))
        expect(screen.getByText(/import requests/)).toBeInTheDocument()

        // Switch to JS
        fireEvent.click(screen.getByRole('button', { name: 'javascript' }))
        expect(screen.getByText(/fetch/)).toBeInTheDocument()

        // Switch to Go
        fireEvent.click(screen.getByRole('button', { name: 'go' }))
        expect(screen.getByText(/package main/)).toBeInTheDocument()
    })

    it('copies content on button click', async () => {
        render(<IntegrationsModal monitorKey="test-key" />)
        fireEvent.click(screen.getByRole('button', { name: /integrations/i }))

        const copyBtn = screen.getByRole('button', { name: /copy code/i })
        fireEvent.click(copyBtn)

        await waitFor(() => {
            expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('curl'))
            expect(toast.success).toHaveBeenCalledWith('Snippet copied to clipboard')
        })
    })

    it('copies correct content after switching tabs', async () => {
        render(<IntegrationsModal monitorKey="test-key" />)
        fireEvent.click(screen.getByRole('button', { name: /integrations/i }))

        // Switch to Python
        fireEvent.click(screen.getByRole('button', { name: 'python' }))

        const copyBtn = screen.getByRole('button', { name: /copy code/i })
        fireEvent.click(copyBtn)

        await waitFor(() => {
            expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('import requests'))
        })
    })
})
