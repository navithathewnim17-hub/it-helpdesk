import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

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

  // Load previously saved tickets.
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const savedTickets = localStorage.getItem('helpdesk-tickets')

      return savedTickets ? JSON.parse(savedTickets) : []
    } catch {
      return []
    }
  })

  // Save whenever the ticket list changes.
  useEffect(() => {
    localStorage.setItem('helpdesk-tickets', JSON.stringify(tickets))
  }, [tickets])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim() || !description.trim()) {
      alert('Please enter a title and description.')
      return
    }

    const newTicket: Ticket = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      status: 'Open',
    }

    setTickets((previousTickets) => [...previousTickets, newTicket])

    setTitle('')
    setDescription('')
  }

  function deleteTicket(id: string) {
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

  // Calculate matching tickets without changing the original list.
  const searchTerm = search.trim().toLowerCase()

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchTerm) ||
      ticket.description.toLowerCase().includes(searchTerm)
  )

  return (
    <main>
      <h1>IT Helpdesk System</h1>
      <p>Report IT problems and track support tickets.</p>

      <h2>Create a ticket</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="ticket-title">Problem title</label>

          <input
            id="ticket-title"
            name="title"
            type="text"
            placeholder="Example: Wi-Fi problem"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div>
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

        <button type="submit">Submit ticket</button>
      </form>

      <section aria-labelledby="tickets-heading">
        <h2 id="tickets-heading">
          Your tickets ({filteredTickets.length} of {tickets.length})
        </h2>

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

        {tickets.length === 0 ? (
          <p>No tickets yet. Create your first ticket above.</p>
        ) : filteredTickets.length === 0 ? (
          <p>No tickets match your search.</p>
        ) : (
          <ul>
            {filteredTickets.map((ticket) => (
              <li key={ticket.id}>
                <h3>{ticket.title}</h3>
                <p>{ticket.description}</p>

                <p>Status: {ticket.status ?? 'Open'}</p>

                <button
                  type="button"
                  onClick={() => toggleTicketStatus(ticket.id)}
                >
                  {ticket.status === 'Resolved'
                    ? 'Reopen ticket'
                    : 'Mark resolved'}
                </button>

                <button
                  type="button"
                  onClick={() => deleteTicket(ticket.id)}
                >
                  Delete ticket
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App