import { NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium'
import puppeteerCore from 'puppeteer-core'
import type { Browser } from 'puppeteer-core'

// Types kept loose to avoid coupling route to client types
type AnyObj = Record<string, any>

export const runtime = 'nodejs'

const isDev = process.env.NODE_ENV === 'development'

export async function POST(req: Request) {
  let browser: Browser | null = null
  try {
    const body = (await req.json()) as AnyObj
    const {
      profile = null,
      projects = [],
      education = [],
      skills = [],
      achievements = [],
      positions = [],
      certifications = [],
      courses = [],
      template = 'modern',
      pageSize = 'A4', // 'A4' | 'Letter'
      fileName = (profile?.name || 'resume') as string,
    } = body || {}

    const html = buildHtml({ profile, projects, education, skills, achievements, positions, certifications, courses, template })

    // In development: use full puppeteer with bundled Chrome
    // In production: use puppeteer-core with @sparticuz/chromium
    if (isDev) {
      // Use full puppeteer in dev (auto-downloads Chromium)
      const puppeteer = await import('puppeteer')
      browser = await puppeteer.default.launch({
        headless: true,
        defaultViewport: { width: 816, height: 1056 },
      })
    } else {
      // Use serverless chromium in production
      const executablePath = await chromium.executablePath()
      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: { width: 816, height: 1056 },
        executablePath,
        headless: true,
      })
    }

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdf = await page.pdf({
      format: pageSize === 'Letter' ? 'Letter' : 'A4',
      printBackground: true,
      margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
    })

    await page.close()
    await browser.close()
    browser = null

    // Copy to a standalone ArrayBuffer to avoid SharedArrayBuffer typing issues
    const arrayBuffer = new ArrayBuffer(pdf.byteLength)
    new Uint8Array(arrayBuffer).set(pdf)
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' })

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=\"${sanitizeFileName(fileName)}.pdf\"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error: any) {
    if (browser) {
      try { await browser.close() } catch {}
    }
    return NextResponse.json({ error: error?.message || 'Failed to generate PDF' }, { status: 500 })
  }
}

function sanitizeFileName(name: string) {
  return (name || 'resume').replace(/[^a-z0-9_\-\.]+/gi, '_').slice(0, 64)
}

function esc(s: any): string {
  if (s == null) return ''
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function join(arr: any[], sep = ', '): string {
  return (arr || []).filter(Boolean).join(sep)
}

function buildHtml(data: AnyObj) {
  const { profile, projects, education, skills, achievements, positions, certifications, courses, template } = data

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(profile?.name || 'Resume')}</title>
  <style>
    /* Basic reset */
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif; color: #111827; }

    /* Page */
    .page { width: 210mm; min-height: 297mm; padding: 14mm; background: #fff; }
    .header { border-bottom: 2px solid #2563EB; padding-bottom: 8px; margin-bottom: 16px; }
    .name { font-size: 28px; font-weight: 800; color: #2563EB; }
    .contact { display: flex; flex-wrap: wrap; gap: 10px; font-size: 12px; color: #4B5563; margin-top: 6px; }

    h2 { font-size: 15px; color: #2563EB; margin: 18px 0 10px; }
    .section { margin-bottom: 14px; }
    .row { display: flex; justify-content: space-between; gap: 8px; }
    .muted { color: #6B7280; }
    .small { font-size: 12px; }
    .xs { font-size: 11px; }
    .pill { display: inline-block; padding: 2px 8px; border-radius: 999px; background: #EFF6FF; color: #1D4ED8; font-size: 11px; margin: 2px 4px 0 0; }
    .list { padding-left: 14px; margin: 0; }
    .list li { margin: 3px 0; }

    /* Template variations (simple placeholder, can be expanded) */
    .t-modern .header { border-color: #2563EB; }
    .t-professional .header { border-color: #0EA5E9; }
    .t-academic .header { border-color: #7C3AED; }
    .t-creative .header { border-color: #DC2626; }
  </style>
</head>
<body class="t-${esc(template)}">
  <div class="page">
    <div class="header">
      <div class="name">${esc(profile?.name || '')}</div>
      <div class="contact">
        ${profile?.email ? `<span>${esc(profile.email)}</span>` : ''}
        ${profile?.phone ? `<span>${esc(profile.phone)}</span>` : ''}
        ${profile?.linkedinLink ? `<span>${esc(profile.linkedinLink)}</span>` : ''}
        ${profile?.githubLink ? `<span>${esc(profile.githubLink)}</span>` : ''}
        ${profile?.portfolioWebsite ? `<span>${esc(profile.portfolioWebsite)}</span>` : ''}
      </div>
    </div>

    ${sectionEducation(education)}
    ${sectionPositions(positions)}
    ${sectionProjects(projects)}
    ${sectionSkills(skills)}
    ${sectionAchievements(achievements)}
    ${sectionCertifications(certifications)}
    ${sectionCourses(courses)}
  </div>
</body>
</html>`
}

function sectionEducation(list: AnyObj[]) {
  if (!list?.length) return ''
  const items = list.map((e: AnyObj) => `
    <div class="section">
      <div class="row"><strong>${esc(e.degree)} in ${esc(e.branch)}</strong><span class="small muted">${esc(e.startYear)} - ${esc(e.endYear || 'Present')}</span></div>
      <div class="small">${esc(e.institute)}</div>
      <div class="xs muted">CGPA: ${esc(e.cgpaOrPercentage)}</div>
    </div>`).join('')
  return `<h2>Education</h2>${items}`
}

function sectionPositions(list: AnyObj[]) {
  if (!list?.length) return ''
  const items = list.map((p: AnyObj) => `
    <div class="section">
      <div class="row"><strong>${esc(p.title)}</strong><span class="small muted">${fmtYear(p.startDate)} - ${fmtYear(p.endDate) || 'Present'}</span></div>
      <div class="small">${esc(p.organization)}</div>
      ${p.description ? `<div class="xs muted">${esc(p.description)}</div>` : ''}
    </div>`).join('')
  return `<h2>Positions of Responsibility</h2>${items}`
}

function sectionProjects(list: AnyObj[]) {
  if (!list?.length) return ''
  const items = list.slice(0, 4).map((pr: AnyObj) => `
    <div class="section">
      <div class="row"><strong>${esc(pr.title)}</strong><span class="small muted">${fmtYear(pr.startDate)}${pr.endDate ? ' - ' + fmtYear(pr.endDate) : ''}</span></div>
      ${pr.description ? `<div class="xs muted">${esc(pr.description)}</div>` : ''}
      ${pr.techStack?.length ? `<div class="xs">Tech: ${esc(join(pr.techStack))}</div>` : ''}
    </div>`).join('')
  return `<h2>Projects</h2>${items}`
}

function sectionSkills(list: AnyObj[]) {
  if (!list?.length) return ''
  const items = list.map((g: AnyObj) => `
    <div class="section">
      <div class="small"><strong>${esc(g.category)}:</strong> ${esc(join((g.skills||[]).map((s: AnyObj) => s.name)))}</div>
    </div>`).join('')
  return `<h2>Skills</h2>${items}`
}

function sectionAchievements(list: AnyObj[]) {
  if (!list?.length) return ''
  const items = list.slice(0, 6).map((a: AnyObj) => `<li>${esc(a.title)}</li>`).join('')
  return `<h2>Achievements</h2><ul class="list small">${items}</ul>`
}

function sectionCertifications(list: AnyObj[]) {
  if (!list?.length) return ''
  const items = list.slice(0, 4).map((c: AnyObj) => `
    <div class="section">
      <div class="small"><strong>${esc(c.title)}</strong></div>
      <div class="xs muted">${esc(c.issuer)}</div>
    </div>`).join('')
  return `<h2>Certifications</h2>${items}`
}

function sectionCourses(list: AnyObj[]) {
  if (!list?.length) return ''
  const items = list.slice(0, 6).map((c: AnyObj) => `
    <div class="section small">
      <div class="row"><strong>${esc(c.title)}</strong><span class="muted">${esc(c.provider)}</span></div>
    </div>`).join('')
  return `<h2>Courses</h2>${items}`
}

function fmtYear(d: any) {
  if (!d) return ''
  try { return String(new Date(d).getFullYear()) } catch { return '' }
}
