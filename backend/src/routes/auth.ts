import { type NextFunction, type Request, type Response, Router } from 'express'
import jwt from 'jsonwebtoken'
import { client } from '../db.js'

const router = Router()
const jwtSecret = process.env.JWT_SECRET ?? 'demo-jwt'

type AuthenticatedRequest = Request & {
  user?: {
    userId: number
    username: string
  }
}

const signToken = (user: { id: number; username: string }) =>
  jwt.sign({ userId: user.id, username: user.username }, jwtSecret, { expiresIn: '7d' })

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Niste prijavljeni.' })
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const decoded = jwt.verify(token, jwtSecret) as { userId: number; username: string }

    req.user = {
      userId: decoded.userId,
      username: decoded.username,
    }

    return next()
  } catch {
    return res.status(401).json({ message: 'Token je nevažeći ili je istekao.' })
  }
}

const normalizeString = (value: unknown) => {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim()
}

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'pccomp-picker-backend' })
})

router.post('/register', async (req, res) => {
  const username = normalizeString(req.body?.username)
  const password = normalizeString(req.body?.password)

  if (!username && !password) {
    return res.status(400).json({ message: 'Korisničko ime i lozinka su obavezni.' })
  }

  if (!username) {
    return res.status(400).json({ message: 'Registracija nije uspjela: korisničko ime je obavezno.' })
  }

  if (!password) {
    return res.status(400).json({ message: 'Registracija nije uspjela: lozinka je obavezna.' })
  }

  if (username.length < 3) {
    return res.status(400).json({ message: 'Registracija nije uspjela: korisničko ime mora imati najmanje 3 znaka.' })
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Registracija nije uspjela: lozinka mora imati najmanje 6 znakova.' })
  }

  try {
    const existing = await client.query('SELECT id FROM korisnici WHERE username = $1', [username])

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Registracija nije uspjela: korisničko ime već postoji. Odaberite drugo.' })
    }

    const result = await client.query(
      'INSERT INTO korisnici (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, password],
    )

    const user = result.rows[0]
    const token = signToken(user)

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    })
  } catch (error) {
    console.error('Greška pri registraciji:', error)
    return res.status(500).json({ message: 'Registracija nije uspjela: došlo je do pogreške na poslužitelju. Pokušajte ponovno.' })
  }
})

router.post('/login', async (req, res) => {
  const username = normalizeString(req.body?.username)
  const password = normalizeString(req.body?.password)

  if (!username || !password) {
    return res.status(400).json({ message: 'Korisničko ime i lozinka su obavezni.' })
  }

  try {
    const result = await client.query(
      'SELECT id, username, password FROM korisnici WHERE username = $1',
      [username],
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Neispravni podaci za prijavu.' })
    }

    const user = result.rows[0]

    if (user.password !== password) {
      return res.status(401).json({ message: 'Neispravni podaci za prijavu.' })
    }

    const token = signToken(user)

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    })
  } catch (error) {
    console.error('Greška pri prijavi:', error)
    return res.status(500).json({ message: 'Interna greška poslužitelja.' })
  }
})

router.post('/logout', authMiddleware, (_req, res) => {
  return res.json({ message: 'Uspješno ste odjavljeni.' })
})

router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.userId

  if (!userId) {
    return res.status(401).json({ message: 'Niste prijavljeni.' })
  }

  try {
    const result = await client.query('SELECT id, username FROM korisnici WHERE id = $1', [userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' })
    }

    const user = result.rows[0]

    return res.json({ user: { id: user.id, username: user.username } })
  } catch (error) {
    console.error('Greška pri dohvaćanju podataka korisnika:', error)
    return res.status(500).json({ message: 'Interna greška poslužitelja.' })
  }
})

router.get('/configurations', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.userId

  if (!userId) {
    return res.status(401).json({ message: 'Niste prijavljeni.' })
  }

  try {
    const result = await client.query(
      `
        SELECT *
        FROM konfiguracije
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
      [userId],
    )

    return res.json({ configurations: result.rows })
  } catch (error) {
    console.error('Greška pri dohvaćanju konfiguracija:', error)
    return res.status(500).json({ message: 'Interna greška poslužitelja.' })
  }
})

router.post('/configurations', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.userId

  if (!userId) {
    return res.status(401).json({ message: 'Niste prijavljeni.' })
  }

  const name = normalizeString(req.body?.name) || 'Moja konfiguracija'
  const cpuId = normalizeString(req.body?.cpu_id ?? req.body?.cpu)
  const gpuId = normalizeString(req.body?.gpu_id ?? req.body?.gpu)
  const ramId = normalizeString(req.body?.ram_id ?? req.body?.ram)
  const storageId = normalizeString(req.body?.storage_id ?? req.body?.storage)
  const coolingId = normalizeString(req.body?.cooling_id ?? req.body?.cooling)
  const psuId = normalizeString(req.body?.psu_id ?? req.body?.psu)
  const caseId = normalizeString(req.body?.case_id ?? req.body?.case)
  const motherboardId = normalizeString(req.body?.motherboard_id ?? req.body?.motherboard)

  try {
    const result = await client.query(
      `
        INSERT INTO konfiguracije (
          user_id,
          name,
          cpu_id,
          gpu_id,
          ram_id,
          storage_id,
          cooling_id,
          psu_id,
          case_id,
          motherboard_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `,
      [userId, name, cpuId, gpuId, ramId, storageId, coolingId, psuId, caseId, motherboardId],
    )

    return res.status(201).json({ configuration: result.rows[0] })
  } catch (error) {
    console.error('Greška pri stvaranju konfiguracije:', error)
    return res.status(500).json({ message: 'Interna greška poslužitelja.' })
  }
})

router.delete('/configurations/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.userId
  const configurationId = Number(req.params.id)

  if (!userId) {
    return res.status(401).json({ message: 'Niste prijavljeni.' })
  }

  if (!Number.isInteger(configurationId)) {
    return res.status(400).json({ message: 'Neispravan ID konfiguracije.' })
  }

  try {
    const result = await client.query(
      'DELETE FROM konfiguracije WHERE id = $1 AND user_id = $2 RETURNING id',
      [configurationId, userId],
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Konfiguracija nije pronađena.' })
    }

    return res.json({ message: 'Konfiguracija je uspješno obrisana.' })
  } catch (error) {
    console.error('Greška pri brisanju konfiguracije:', error)
    return res.status(500).json({ message: 'Interna greška poslužitelja.' })
  }
})

export default router
