import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom'
import CreatePost from '../CreatePost'
import CreatePostPage from "../../pages/CreatePost.jsx";

describe('CreatePost Component', () => {
    beforeEach(() => {
        render(
        <MemoryRouter>
            <Routes>
                <Route path = "/" element={<CreatePost />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            </Routes>
        </MemoryRouter>
        )
    })
    
    it('renders the CreatePost component', () => {
        expect(screen.getByText('Start a Post')).toBeInTheDocument()
    })
    
    it('navigates to create post page on button click', () => {
        const button = screen.getByText('Start a Post')
        fireEvent.click(button)
        expect(screen.getByText('Create a Post')).toBeInTheDocument()
    })
    })