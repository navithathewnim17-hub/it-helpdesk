import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Ticket = {
  id: string
  title: string
  description: string
  status?: 'Open' | 'Resolved'
}

function App() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [editingId, setEditingId] = useState<string | null>(null)

  // Load saved tickets when the component initializes.
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const savedTickets = localStorage.getItem('helpdesk-tickets')

      return savedTickets ? JSON.parse(savedTickets) : []
    } catch {
      return []
    }
  })

  // Save the list whenever tickets change.
  useEffect(() => {
    localStorage.setItem('helpdesk-tickets', JSON.stringify(tickets))
  }, [tickets])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim() || !description.trim()) {
      alert('Please enter a title and description.')
      return
    }

    if (editingId !== null) {
      // Update the matching ticket.
      setTickets((previousTickets) =>
        previousTickets.map((ticket) =>
          ticket.id === editingId
            ? {
                ...ticket,
                title: title.trim(),
                description: description.trim(),
              }
            : ticket
        )
      )
    } else {
      // Create a new ticket.
      const newTicket: Ticket = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        status: 'Open',
      }

      setTickets((previousTickets) => [...previousTickets, newTicket])
    }

    cancelEditing()
  }

  function startEditing(ticket: Ticket) {
    setEditingId(ticket.id)
    setTitle(ticket.title)
    setDescription(ticket.description)

    document.getElementById('ticket-title')?.focus()
  }

  function cancelEditing() {
    setEditingId(null)
    setTitle('')
    setDescription('')
  }

  function deleteTicket(id: string) {
    if (editingId === id) {
      cancelEditing()
    }

    setTickets((previousTickets) =>
      previousTickets.filter((ticket) => ticket.id !== id)
    )
  }

  function toggleTicketStatus(id: string) {
    setTickets((previousTickets) =>
      previousTickets.map((ticket) => {
        if (ticket.id !== id) {
          return ticket
        }

        return {
          ...ticket,
          status: ticket.status === 'Resolved' ? 'Open' : 'Resolved',
        }
      })
    )
  }

  // Summary counts always use the complete list.
  const totalTickets = tickets.length

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === 'Resolved'
  ).length

  const openTickets = totalTickets - resolvedTickets

  // Search and status filtering only change the displayed list.
  const searchTerm = search.trim().toLowerCase()

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm) ||
      ticket.description.toLowerCase().includes(searchTerm)

    const matchesStatus =
      statusFilter === 'All' ||
      (ticket.status ?? 'Open') === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <main>
      <header className="page-header">
        <h1>IT Helpdesk System</h1>
        <p>Report IT problems and track support tickets.</p>
      </header>

      <div className="ticket-stats" aria-label="Ticket summary">
        <div className="stat-card">
          <span>Total tickets</span>
          <strong>{totalTickets}</strong>
        </div>

        <div className="stat-card">
          <span>Open</span>
          <strong>{openTickets}</strong>
        </div>

        <div className="stat-card">
          <span>Resolved</span>
          <strong>{resolvedTickets}</strong>
        </div>
      </div>

      <h2>{editingId !== null ? 'Edit ticket' : 'Create a ticket'}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="ticket-title">Problem title</label>

          <input
            id="ticket-title"
            name="title"
            type="text"
            placeholder="Example: Laptop cannot connect to Wi-Fi"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="ticket-description">
            Describe the problem
          </label>

          <textarea
            id="ticket-description"
            name="description"
            rows={5}
            placeholder="Explain what happened..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="button-group">
          <button type="submit">
            {editingId !== null ? 'Save changes' : 'Submit ticket'}
          </button>

          {editingId !== null && (
            <button
              className="button-secondary"
              type="button"
              onClick={cancelEditing}
            >
              Cancel editing
            </button>
          )}
        </div>
      </form>

      <section aria-labelledby="tickets-heading">
        <h2 id="tickets-heading">
          Your tickets ({filteredTickets.length} of {totalTickets})
        </h2>

        <div className="ticket-filters">
          <div>
            <label htmlFor="ticket-search">Search tickets</label>

            <input
              id="ticket-search"
              type="search"
              placeholder="Search by title or description..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="status-filter">Filter by status</label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All tickets</option>
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {totalTickets === 0 ? (
          <p className="empty-message">
            No tickets yet. Create your first ticket above.
          </p>
        ) : filteredTickets.length === 0 ? (
          <p className="empty-message">
            No tickets match your search and status filter.
          </p>
        ) : (
          <ul className="ticket-list">
            {filteredTickets.map((ticket) => (
              <li className="ticket-card" key={ticket.id}>
                <div className="ticket-card-header">
                  <h3>{ticket.title}</h3>

                  <span
                    className={`status-badge ${
                      ticket.status === 'Resolved'
                        ? 'status-resolved'
                        : 'status-open'
                    }`}
                  >
                    {ticket.status ?? 'Open'}
                  </span>
                </div>

                <p className="ticket-description">
                  {ticket.description}
                </p>

                <div className="button-group">
                  <button
                    className="button-secondary"
                    type="button"
                    onClick={() => startEditing(ticket)}
                  >
                    Edit ticket
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleTicketStatus(ticket.id)}
                  >
                    {ticket.status === 'Resolved'
                      ? 'Reopen ticket'
                      : 'Mark resolved'}
                  </button>

                  <button
                    className="button-danger"
                    type="button"
                    onClick={() => deleteTicket(ticket.id)}
                  >
                    Delete ticket
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App