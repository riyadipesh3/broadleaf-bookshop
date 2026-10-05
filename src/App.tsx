import { useEffect, useRef, useState, type ReactNode } from 'react'

/* IntersectionObserver reveal. No scroll listeners anywhere on this page. */
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* Six titles from the shelf, each with the edition we actually stock.
   ISBNs are the trade paperback ISBN-13 of that edition, hyphenated.
   No cover art: we have no rights to the jackets, so the grid is a typed
   catalogue card grid instead, which is what the shop actually uses. */
const SHELF = [
  {
    title: 'Middlemarch',
    author: 'George Eliot',
    imprint: 'Penguin Classics',
    genre: 'Fiction, 1871',
    pages: '904 pp.',
    isbn: '978-0-1414-3954-9',
    price: '£12.99',
    note: 'Eight hundred and fifty-two pages in this edition, and worth the shelf space.',
  },
  {
    title: 'The Crow Road',
    author: 'Iain Banks',
    imprint: 'Abacus',
    genre: 'Fiction, 1992',
    pages: '501 pp.',
    isbn: '978-0-3491-3915-9',
    price: '£9.99',
    note: 'The paperback that never leaves the window, whatever the weather.',
  },
  {
    title: 'Lanark',
    author: 'Alasdair Gray',
    imprint: 'Canongate Canons',
    genre: 'Fiction, 1981',
    pages: '592 pp.',
    isbn: '978-1-7821-1714-8',
    price: '£10.99',
    note: 'Four books in one. Gray illustrated the cover of this edition himself.',
  },
  {
    title: 'Austerlitz',
    author: 'W. G. Sebald',
    imprint: 'Penguin Modern Classics',
    genre: 'Fiction, 2001',
    pages: '320 pp.',
    isbn: '978-0-2419-5180-4',
    price: '£11.99',
    note: 'Photographs run through the text, which is most of why it is worth reading.',
  },
  {
    title: 'Gilead',
    author: 'Marilynne Robinson',
    imprint: 'Picador',
    genre: 'Fiction, 2004',
    pages: '256 pp.',
    isbn: '978-0-3124-2440-4',
    price: '£8.99',
    note: 'A letter written late in a long life, and one of the last books we stocked on trust.',
  },
  {
    title: 'Bluets',
    author: 'Maggie Nelson',
    imprint: 'Wave Books',
    genre: 'Essay, 2009',
    pages: '112 pp.',
    isbn: '978-1-9335-1740-7',
    price: '£9.99',
    note: 'Two hundred and forty numbered fragments on a single colour. Fits in a coat.',
  },
]

/* The autumn diary. Formats are the ones a shop with a back room runs:
   readings, a signing, and a workshop where places are genuinely limited. */
const DIARY = [
  {
    date: 'Thu 8 Oct',
    format: 'Reading and conversation',
    title: 'Salt and Smoke',
    who: 'Mairi Sinclair in conversation with Kirsty Menzies',
    detail: 'Back room, forty places, £8 at the door',
    seats: '41 places left',
  },
  {
    date: 'Sat 17 Oct',
    format: 'Signing',
    title: 'The Long Shallows',
    who: 'Alasdair Fraser, first hardcover printing',
    detail: 'Shop floor, sixty copies brought up from the cellar',
    seats: 'No charge to sign',
  },
  {
    date: 'Thu 29 Oct',
    format: 'Workshop',
    title: 'Fold a chapbook in an evening',
    who: 'With Rhona Sutherland, two hours at the long table',
    detail: 'Long table, twelve places, £14 with all materials supplied',
    seats: '4 places left',
  },
  {
    date: 'Sat 14 Nov',
    format: 'Reading',
    title: 'The North Wall',
    who: 'Eilidh Craig with the Hebridean Readers',
    detail: 'Back room, fifty places, £6 at the door',
    seats: 'Book at the desk',
  },
]

const ROOM = [
  { k: 'Seating', v: 'Thirty-one places on benches and two armchairs' },
  { k: 'Opening', v: 'Tuesday to Sunday, 10.00am until 6.00pm' },
  { k: 'Cost', v: 'Free, no membership, no card, no minimum spend' },
  { k: 'Power', v: 'A socket at every second bench, and the kettle behind the counter' },
]

function QuoteMark() {
  return (
    <svg width="34" height="26" viewBox="0 0 34 26" fill="none" aria-hidden="true">
      <path
        d="M0 26V14.6C0 6.2 4.4 1 12.4 0l1.4 4.2c-4.4 1.2-6.6 3.8-6.8 7.6h6.4V26H0zm20.2 0V14.6C20.2 6.2 24.6 1 32.6 0L34 4.2c-4.4 1.2-6.6 3.8-6.8 7.6h6.4V26H20.2z"
        fill="currentColor"
      />
    </svg>
  )
}

function ArrowGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M2 11L11 2M11 2H4.2M11 2v6.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [session, setSession] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) {
      setError('Choose which evening you want a place at.')
      return
    }
    if (name.trim().length < 2) {
      setError('Add the name the place should be held under.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError('That address will not reach you. Check it over.')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <>
      <header className="sheet-raised torn-bottom sticky top-0 z-30">
        <div className="shell flex h-18 max-h-20 items-center justify-between gap-6 py-3">
          <a href="#top" className="flex flex-col leading-none">
            <span className="press font-display text-[1.35rem] font-semibold tracking-[-0.03em]">
              Broadleaf
            </span>
            <span className="meta mt-1 text-[0.625rem]">Booksellers since 2009</span>
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            <a href="#shelf" className="link-underline text-sm text-ink-soft hover:text-ink">
              The shelf
            </a>
            <a href="#room" className="link-underline text-sm text-ink-soft hover:text-ink">
              Reading room
            </a>
            <a href="#diary" className="link-underline text-sm text-ink-soft hover:text-ink">
              What is on
            </a>
          </nav>
          <a href="#reserve" className="btn btn-primary !py-2 !text-sm">
            Reserve a place
          </a>
        </div>
      </header>

      <main id="top">
        {/* Hero: split, copy left, a stack of folded sheets right. */}
        <section className="shell flex min-h-[100dvh] items-center pt-24 pb-16">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <p className="micro mb-6">Independent booksellers</p>
              <h1 className="press text-[clamp(2.3rem,4.5vw,3.85rem)] leading-[1.03]">
                Secondhand, rare, and read to the last page.
              </h1>
              <p className="mt-7 max-w-[46ch] text-[1.0625rem] leading-[1.65] text-ink-soft">
                Broadleaf has sold books from this room since 2009, with a free reading room above
                the shop.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3.5">
                <a href="#shelf" className="btn btn-primary">
                  See the shelf
                  <span className="btn-icon">
                    <ArrowGlyph />
                  </span>
                </a>
                <a href="#reserve" className="btn btn-ghost">
                  Reserve a place
                </a>
              </div>
            </Reveal>

            <Reveal delay={140}>
              {/* Three sheets in a stack. Each sits on its own offset, and
                  each carries a different paper device: the back sheet a
                  deckled left edge and a thumb notch, the middle sheet a
                  torn foot, the front sheet a crease and a dog-ear. */}
              <div className="relative mx-auto h-[27rem] w-full max-w-md sm:h-[30rem] lg:mx-0 lg:ml-auto">
                {/* Back sheet: shaded, deckled down the left, corner notched. */}
                <div className="sheet-shade deckle-left torn-top absolute inset-y-4 left-0 w-[86%] rotate-[-1.4deg]" />
                {/* Middle sheet: torn along the foot. */}
                <div className="sheet torn-bottom torn-top absolute inset-y-7 right-0 w-[86%] rotate-[1.1deg]" />
                {/* Front sheet: raised, creased on its fold-in line. The
                    dog-ear belongs on the SHEET, not on the photograph, so it
                    is notched out of the sheet itself. */}
                <div
                  className="sheet-raised sheet-fold notch absolute inset-y-0 left-[7%] w-[86%]"
                  style={{ '--fold-at': '72%' } as React.CSSProperties}
                >
                  <div className="fold-content notch-clip absolute inset-0 flex flex-col">
                    <img
                      src="https://picsum.photos/seed/ink-stain-fingers/900/560"
                      alt="Tied bundles of old letters and paper stacked on a desk beside a pen"
                      width={900}
                      height={560}
                      className="h-[72%] w-full object-cover"
                      loading="eager"
                    />
                    <div className="flex flex-1 flex-col justify-end gap-1 px-6 pb-5 pt-3">
                      <p className="text-sm text-ink-soft">Second-hand shelf, front of house</p>
                      <p className="meta text-pen">Est. 2009</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* The shelf. A card grid, six cells for six books, plus one
            large photograph in its own row. No decorative cover art. */}
        <section id="shelf" className="shell py-24 md:py-32">
          <Reveal>
            <h2 className="max-w-[18ch] text-[clamp(2rem,3.9vw,3.1rem)]">
              Six we keep coming back to.
            </h2>
            <p className="mt-5 max-w-[58ch] leading-[1.7] text-ink-soft">
              The editions below are the ones on the shelf today. Every copy is priced as marked and
              we will post any of them the same afternoon.
            </p>
          </Reveal>

          {/* The shelf, laid out as a shelf: two wide catalogue strips on
              the top board, four compact cards beneath. Six cells for six
              books, no empty cell, and not a 3 + 3 block. */}
          <div className="mt-14 grid gap-x-6 gap-y-8 lg:grid-cols-2">
            {SHELF.slice(0, 2).map((b, i) => (
              <Reveal key={b.isbn} delay={i * 80} className="flex">
                <article className="sheet flex w-full flex-col gap-3 p-7">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="meta text-pen">{b.genre}</p>
                    <p className="press font-display text-xl">{b.price}</p>
                  </div>
                  <h3 className="press text-[1.75rem] leading-[1.1]">{b.title}</h3>
                  <p className="text-base text-ink-soft">{b.author}</p>
                  <p className="flex-1 max-w-[46ch] text-[0.9375rem] leading-[1.65] text-ink-faint">
                    {b.note}
                  </p>
                  <hr className="rule my-1" />
                  <dl className="meta flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <dt>{b.imprint}</dt>
                    <dd>{b.pages}</dd>
                    <dd className="w-full sm:w-auto">ISBN {b.isbn}</dd>
                  </dl>
                </article>
              </Reveal>
            ))}

            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
              {SHELF.slice(2).map((b, i) => (
                <Reveal key={b.isbn} delay={(i + 2) * 80} className="flex">
                  <article className="sheet flex w-full flex-col gap-2 p-5">
                    <p className="meta text-pen">{b.genre}</p>
                    <h3 className="press text-[1.1875rem] leading-[1.14]">{b.title}</h3>
                    <p className="text-sm text-ink-soft">{b.author}</p>
                    <p className="flex-1 text-[0.875rem] leading-[1.6] text-ink-faint">{b.note}</p>
                    <hr className="rule my-1" />
                    <dl className="meta space-y-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <dt>{b.imprint}</dt>
                        <dd className="press font-display text-sm">{b.price}</dd>
                      </div>
                      <div>ISBN {b.isbn}</div>
                    </dl>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Reading room: a wide folded sheet, facts set as index cards
            beneath it. No photograph, because the layout carries itself. */}
        <section id="room" className="shell py-24 md:py-32">
          <Reveal>
            {/* Wide creased sheet. The crease sits on the gutter between the
                two halves, which is where a folded sheet would actually be. */}
            <div
              className="sheet sheet-fold fold-vertical fold-vertical-folded edge-lit px-7 py-12 md:px-14 md:py-16"
              style={{ '--fold-x': '57%' } as React.CSSProperties}
            >
              <div className="fold-content grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
                <div>
                  <h2 className="max-w-[16ch] text-[clamp(2rem,3.9vw,3.1rem)]">
                    A room upstairs where nobody has to buy anything.
                  </h2>
                  <p className="mt-6 max-w-[50ch] leading-[1.7] text-ink-soft">
                    Thirty-one places on benches and two armchairs, a window onto the wynd, and a
                    rule about phones that we enforce gently. People come to read, to finish a
                    series, or simply to sit out a Fife afternoon.
                  </p>
                </div>
                <div className="flex flex-col justify-center gap-5">
                  <p className="meta text-pen">No charge, no membership</p>
                  <p className="text-[0.9375rem] leading-[1.65] text-ink-soft">
                    The kettle lives behind the counter and nobody has ever been asked to order a
                    second one.
                  </p>
                  <hr className="rule" />
                  <p className="text-[0.9375rem] leading-[1.65] text-ink-soft">
                    No one has ever been asked to leave a book behind either, though the box by the
                    stairs has quietly filled up twice.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Four index cards, ruled and tabbed. */}
          <div className="mt-8 grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {ROOM.map((r, i) => (
              <Reveal key={r.k} delay={i * 70} className="flex">
                <article className="sheet flex w-full flex-col gap-2 p-5">
                  <p className="meta text-pen">{r.k}</p>
                  <p className="flex-1 text-[0.9375rem] leading-[1.65] text-ink-soft">{r.v}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* What is on: four rows on a docket torn at both ends. */}
        <section id="diary" className="shell py-24 md:py-32">
          <Reveal>
            <p className="micro mb-6">Autumn diary</p>
            <h2 className="max-w-[20ch] text-[clamp(2rem,3.9vw,3.1rem)]">
              Four evenings we have chairs out for.
            </h2>
          </Reveal>

          <div className="mt-12">
            <Reveal>
              <div className="sheet torn-both">
                <ol>
                  {DIARY.map((ev) => (
                    <li
                      key={ev.title}
                      className="fold-content grid gap-x-8 gap-y-3 px-6 py-8 md:grid-cols-[8rem_1fr_auto] md:items-baseline md:px-10 md:py-9"
                    >
                      <p className="meta text-pen">{ev.date}</p>
                      <div className="min-w-0 md:border-l md:border-ink/12 md:pl-8">
                        <p className="meta">{ev.format}</p>
                        <h3 className="press mt-1.5 text-xl leading-[1.2]">{ev.title}</h3>
                        <p className="mt-1.5 text-[0.9375rem] text-ink-soft">{ev.who}</p>
                        <p className="mt-2 text-[0.9375rem] text-ink-faint">{ev.detail}</p>
                      </div>
                      <p className="meta md:text-right">{ev.seats}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Quote: one folded sheet, used once. */}
        <section className="shell py-24 md:py-32">
          <Reveal>
            {/* The quote sits on a sheet folded once, with the crease
                crossing the attribution rule rather than the quote itself. */}
            <figure
              className="sheet sheet-fold notch edge-lit px-7 py-12 text-center md:px-16 md:py-16"
              style={{ '--fold-at': '74%' } as React.CSSProperties}
            >
              <div className="fold-content mx-auto flex max-w-[54ch] flex-col items-center">
                <span className="text-pen">
                  <QuoteMark />
                </span>
                <blockquote className="press mt-7 text-[clamp(1.4rem,2.5vw,1.9rem)] leading-[1.34] tracking-[-0.018em]">
                  They shelved Lanark face out for a month when it arrived. I came in for a birthday
                  card and left with the novel.
                </blockquote>
                <figcaption className="meta mt-8 w-full border-t border-ink/14 pt-5">
                  Niamh Docherty, reader, Dundee
                </figcaption>
              </div>
            </figure>
          </Reveal>
        </section>

        {/* Reserve: address left, form on a notched sheet right. */}
        <section id="reserve" className="shell pb-24 md:pb-32">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
            <Reveal>
              <h2 className="max-w-[14ch] text-[clamp(2rem,3.9vw,3.1rem)]">
                Put a name down for an evening.
              </h2>
              <p className="mt-6 max-w-[44ch] leading-[1.7] text-ink-soft">
                Places are held at the desk, not on a website, and we will telephone you if anything
                changes. Nothing is charged here.
              </p>
              <dl className="mt-10 space-y-5">
                {[
                  ['The shop', '14 Market Street, St Andrews KY16 9PQ'],
                  ['Telephone', '01334 480 217'],
                  ['Back room door', 'Opens ten minutes before each reading'],
                ].map(([k, v]) => (
                  <div key={k} className="border-t border-ink/14 pt-4">
                    <dt className="meta">{k}</dt>
                    <dd className="mt-2 max-w-[38ch] text-[0.9375rem] text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={120}>
              <form className="sheet-raised notch p-7 md:p-10" onSubmit={submit} noValidate>
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="field-label">
                    Name for the place
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Niamh Docherty"
                    aria-describedby="name-hint"
                  />
                  <p id="name-hint" className="meta">
                    One name per place, held at the desk under it
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <label htmlFor="email" className="field-label">
                    Where to write
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-describedby="email-hint"
                  />
                  <p id="email-hint" className="meta">
                    We only use it if the evening has to move
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <label htmlFor="session" className="field-label">
                    Which evening
                  </label>
                  <select
                    id="session"
                    name="session"
                    className="field"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    aria-describedby="session-hint"
                  >
                    <option value="">Select one of the four</option>
                    {DIARY.map((ev) => (
                      <option key={ev.title} value={ev.title}>
                        {ev.date} / {ev.format}
                      </option>
                    ))}
                  </select>
                  <p id="session-hint" className="meta">
                    Workshops are capped at twelve places, so those go first
                  </p>
                </div>

                {error && (
                  <p role="alert" className="mt-6 border-l-2 border-pen pl-3 text-sm text-pen">
                    {error}
                  </p>
                )}

                {sent ? (
                  <div className="sheet mt-7 px-5 py-4 text-sm" role="status">
                    Held for {name.trim()}. We have written to {email} with the room details.
                  </div>
                ) : (
                  <button type="submit" className="btn btn-primary mt-8 self-start">
                    Reserve a place
                    <span className="btn-icon">
                      <ArrowGlyph />
                    </span>
                  </button>
                )}
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="sheet-raised torn-top torn-top-board">
        <div className="shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
          <div>
            <p className="press font-display text-lg">Broadleaf</p>
            <p className="mt-3 max-w-[40ch] text-sm leading-[1.65] text-ink-soft">
              Second-hand and rare books on Market Street, and a reading room upstairs that costs
              nothing to use.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
            <a href="#shelf" className="link-underline text-ink-soft hover:text-ink">
              The shelf
            </a>
            <a href="#room" className="link-underline text-ink-soft hover:text-ink">
              Reading room
            </a>
            <a href="#diary" className="link-underline text-ink-soft hover:text-ink">
              What is on
            </a>
          </nav>
          <div className="text-sm text-ink-soft">
            <p>14 Market Street</p>
            <p className="mt-1">St Andrews KY16 9PQ</p>
            <a href="#reserve" className="link-underline mt-4 inline-block hover:text-ink">
              Reserve a place
            </a>
          </div>
        </div>
        <div className="shell border-t border-ink/12 py-7">
          <p className="meta">
            Developed by{' '}
            <a href="https://thediyadevelopers.com" className="link-underline text-ink">
              Diya Developers
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}
