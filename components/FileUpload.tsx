"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Upload, Star, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface UploadedFile {
  id?: number
  url: string
  fileName: string
  fileSize: number
  isPrimary: boolean
  file?: File
}

interface FileUploadProps {
  productId?: number
  variantId?: number | null
  maxFiles?: number
  onFilesChange: (files: UploadedFile[]) => void
  existingFiles?: UploadedFile[]
  title?: string
  hasVariants?: boolean
  totalProductFiles?: number // Para calcular límite total cuando hay variantes
}

export default function FileUpload({
  productId,
  variantId,
  maxFiles = 8,
  onFilesChange,
  existingFiles = [],
  title = "Imágenes del Producto",
  hasVariants = false,
  totalProductFiles = 0,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()

  // Calcular límite real basado en el contexto
  const getRealMaxFiles = () => {
    if (variantId) {
      // Para variantes: siempre máximo 2
      return 2
    } else if (hasVariants) {
      // Para producto principal con variantes: verificar límite total de 20
      const remainingSlots = 20 - totalProductFiles
      return Math.min(remainingSlots, 8) // Máximo 8 para producto principal, pero respetando límite total
    } else {
      // Para producto sin variantes: máximo 8
      return 8
    }
  }

  const realMaxFiles = getRealMaxFiles()
  const canAddMore = files.length < realMaxFiles

  const handleFiles = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const fileArray = Array.from(selectedFiles)

    if (files.length + fileArray.length > realMaxFiles) {
      const message = variantId
        ? "Solo puedes subir máximo 2 archivos por variante"
        : hasVariants
          ? `Solo puedes subir máximo ${realMaxFiles} archivos (límite total: 20 para productos con variantes)`
          : "Solo puedes subir máximo 8 archivos para el producto"

      toast({
        title: "Límite excedido",
        description: message,
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setUploadProgress(0)

    const newFiles: UploadedFile[] = []

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]

      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Archivo no válido",
          description: `${file.name} no es una imagen válida`,
          variant: "destructive",
        })
        continue
      }

      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: `${file.name} excede el límite de 5MB`,
          variant: "destructive",
        })
        continue
      }

      try {
        // Si tenemos productId, subir inmediatamente
        if (productId) {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("productId", productId.toString())
          if (variantId) formData.append("variantId", variantId.toString())
          formData.append("isPrimary", (files.length === 0 && i === 0).toString())

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          const result = await response.json()

          if (!response.ok) {
            throw new Error(result.error || "Error al subir archivo")
          }

          newFiles.push(result.media)
        } else {
          // Si no tenemos productId, solo preparar para subir después
          const url = URL.createObjectURL(file)
          newFiles.push({
            url,
            fileName: file.name,
            fileSize: file.size,
            isPrimary: files.length === 0 && i === 0,
            file,
          })
        }

        setUploadProgress(((i + 1) / fileArray.length) * 100)
      } catch (error) {
        console.error("Error uploading file:", error)
        toast({
          title: "Error",
          description: `Error al subir ${file.name}: ${error instanceof Error ? error.message : "Error desconocido"}`,
          variant: "destructive",
        })
      }
    }

    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
    setUploading(false)
    setUploadProgress(0)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const removeFile = (index: number) => {
    const fileToRemove = files[index]
    if (fileToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(fileToRemove.url)
    }

    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const setPrimary = (index: number) => {
    const updatedFiles = files.map((file, i) => ({
      ...file,
      isPrimary: i === index,
    }))
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${files.length >= realMaxFiles ? "text-red-400" : "text-gray-400"}`}>
            {files.length}/{realMaxFiles} archivos
          </span>
          {hasVariants && !variantId && (
            <div className="flex items-center space-x-1 text-xs text-yellow-500">
              <AlertCircle size={12} />
              <span>Límite total: 20</span>
            </div>
          )}
        </div>
      </div>

      {/* Zona de Drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive ? "border-yellow-500 bg-yellow-500/10" : "border-gray-600 hover:border-gray-500"
        } ${uploading || !canAddMore ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          disabled={uploading || !canAddMore}
          className="hidden"
          id={`file-upload-${variantId || "main"}`}
        />
        <label htmlFor={`file-upload-${variantId || "main"}`} className="cursor-pointer">
          <Upload className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-white mb-2">
            {!canAddMore
              ? "Límite de archivos alcanzado"
              : dragActive
                ? "Suelta las imágenes aquí..."
                : "Arrastra imágenes aquí o haz clic para seleccionar"}
          </p>
          <p className="text-sm text-gray-500">
            JPG, PNG, GIF, WEBP • Máximo 5MB cada uno
            {variantId && " • Máximo 2 por variante"}
          </p>
        </label>
      </div>

      {/* Progreso de subida */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Subiendo archivos...</span>
            <span className="text-yellow-500">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Lista de archivos */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
                <Image
                  src={file.url || "/placeholder.svg"}
                  alt={file.fileName}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  unoptimized={file.url.startsWith("blob:")}
                />

                {/* Overlay con controles */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPrimary(index)}
                    className={`${
                      file.isPrimary
                        ? "bg-yellow-500 text-black border-yellow-500"
                        : "bg-black/50 text-white border-gray-500"
                    }`}
                  >
                    <Star size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeFile(index)}
                    className="bg-red-900/50 text-red-300 border-red-700 hover:bg-red-800"
                  >
                    <X size={14} />
                  </Button>
                </div>

                {/* Indicador de imagen principal */}
                {file.isPrimary && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium">
                    Principal
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-1 truncate">{file.fileName}</p>
              <p className="text-xs text-gray-500">{(file.fileSize / 1024 / 1024).toFixed(1)} MB</p>
            </div>
          ))}
        </div>
      )}

      {/* Información de límites */}
      {hasVariants && !variantId && (
        <div className="bg-gray-900 border border-gray-600 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="text-yellow-500" size={16} />
            <h4 className="text-white text-sm font-medium">Límites de Archivos</h4>
          </div>
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Producto principal: hasta 8 imágenes</p>
            <p>• Cada variante: hasta 2 imágenes</p>
            <p>• Total máximo: 20 imágenes</p>
          </div>
        </div>
      )}
    </div>
  )
}
