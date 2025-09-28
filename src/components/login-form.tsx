'use client'

import React, { useState } from 'react'
import axios from 'axios'
import {
  Search,
  MapPin,
  Building,
  Home,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

interface PostalCode {
  code: string
  village: string
  district: string
  regency: string
  province: string
  latitude?: number
  longitude?: number
  elevation: number
  timezone: string
}

export default function KodePosIndonesia() {
  const [provinsi, setProvinsi] = useState('')
  const [kabupaten, setKabupaten] = useState('')
  const [kecamatan, setKecamatan] = useState('')
  const [, setSearchQuery] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<PostalCode[]>([])

  const handleSearch = async () => {
    if (!provinsi.trim() && !kabupaten.trim() && !kecamatan.trim()) {
      setError('Masukkan minimal satu kriteria pencarian')
      return
    }

    setError('')
    setResults([])

    const queryParts = []
    if (provinsi.trim()) queryParts.push(provinsi.trim())
    if (kabupaten.trim()) queryParts.push(kabupaten.trim())
    if (kecamatan.trim()) queryParts.push(kecamatan.trim())

    const newSearchQuery = queryParts.join(' ')
    setSearchQuery(newSearchQuery)

    try {
      setLoading(true)
      const { data } = await axios.get(
        `https://kodepos.vercel.app/search/?q=${encodeURIComponent(newSearchQuery)}`,
      )

      if (data.statusCode === 200 && data.data) {
        const filteredResults = (data.data as PostalCode[]).filter((item) => {
          return (
            (!provinsi ||
              item.province.toLowerCase().includes(provinsi.toLowerCase())) &&
            (!kabupaten ||
              item.regency.toLowerCase().includes(kabupaten.toLowerCase())) &&
            (!kecamatan ||
              item.district.toLowerCase().includes(kecamatan.toLowerCase()))
          )
        })

        if (filteredResults.length === 0) {
          setError('Tidak ada hasil yang ditemukan')
        }

        setResults(filteredResults)
      } else {
        setError('Terjadi kesalahan dalam pencarian')
      }
    } catch (err) {
      setError('Gagal mengambil data. Periksa koneksi atau coba lagi.' + err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleReset = () => {
    setProvinsi('')
    setKabupaten('')
    setKecamatan('')
    setSearchQuery('')
    setError('')
    setResults([])
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto p-4">
      <div className="flex flex-col items-center gap-2">
        <Link href="#" className="flex flex-col items-center gap-2 font-medium">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <MapPin className="size-6" />
          </div>
          <span className="sr-only">Kode Pos Indonesia</span>
        </Link>
        <h1 className="text-xl font-bold">Pencarian Kode Pos Indonesia</h1>
        <div className="text-center text-sm text-muted-foreground">
          Cari berdasarkan Provinsi, Kabupaten/Kota, dan Kecamatan
        </div>
      </div>

      <div className="flex flex-col gap-6 items-center">
        <div className="flex flex-col gap-4 w-full max-w-md">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="provinsi"
              className="text-sm font-medium flex items-center gap-1"
            >
              <Building className="inline w-4 h-4" />
              Provinsi
            </label>
            <input
              id="provinsi"
              type="text"
              value={provinsi}
              onChange={(e) => setProvinsi(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Contoh: Jawa Barat"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="kabupaten"
              className="text-sm font-medium flex items-center gap-1"
            >
              <Home className="inline w-4 h-4" />
              Kabupaten/Kota
            </label>
            <input
              id="kabupaten"
              type="text"
              value={kabupaten}
              onChange={(e) => setKabupaten(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Contoh: Bandung"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="kecamatan"
              className="text-sm font-medium flex items-center gap-1"
            >
              <MapPin className="inline w-4 h-4" />
              Kecamatan
            </label>
            <input
              id="kecamatan"
              type="text"
              value={kecamatan}
              onChange={(e) => setKecamatan(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Contoh: Coblong"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 w-full max-w-md">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mencari...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Cari Kode Pos
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Reset
          </button>
        </div>

        {error && (
          <div className="bg-destructive/15 border border-destructive/20 text-destructive px-4 py-3 rounded-md flex items-center justify-center gap-2 w-full max-w-md">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="space-y-4 w-full">
          <h2 className="text-lg font-semibold text-center">
            Hasil Pencarian ({results.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {results.map((item, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-4 bg-card space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">
                    {item.code}
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    Kode Pos
                  </span>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Home className="w-3 h-3 text-muted-foreground" />
                    <span className="font-medium">{item.village}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>
                      Kec. {item.district}, {item.regency}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="w-3 h-3" />
                    <span>Provinsi {item.province}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border/50">
                  {item.latitude && item.longitude && (
                    <div>
                      Koordinat: {item.latitude.toFixed(4)},{' '}
                      {item.longitude.toFixed(4)}
                    </div>
                  )}
                  <div>
                    Ketinggian: {item.elevation}m • Zona: {item.timezone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center text-xs text-muted-foreground">
        <div>
          Data dari{' '}
          <Link
            href="https://github.com/sooluh/kodepos"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 text-primary"
          >
            API Kode Pos Indonesia
          </Link>
        </div>
      </div>
    </div>
  )
}
