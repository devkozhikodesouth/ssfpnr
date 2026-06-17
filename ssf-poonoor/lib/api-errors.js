import { NextResponse } from 'next/server'

/** Map a thrown error to a JSON error response, honoring err.status and Mongo dup keys. */
export function errorResponse(err) {
  if (err?.status) {
    return NextResponse.json({ success: false, error: err.message }, { status: err.status })
  }
  if (err?.code === 11000) {
    return NextResponse.json({ success: false, error: 'Duplicate value' }, { status: 409 })
  }
  return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 })
}

/** Build an Error carrying an HTTP status for errorResponse to surface. */
export function httpError(message, status = 400) {
  const err = new Error(message)
  err.status = status
  return err
}
