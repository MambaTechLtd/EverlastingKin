import React, { useState } from 'react'
import { User, Calendar, MapPin, FileText, Upload, Camera, Video, Save, X, Plus } from 'lucide-react'
import { createDeceasedRecord, DeceasedRecord } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

interface DeceasedRecordFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const DeceasedRecordForm: React.FC<DeceasedRecordFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    estimated_age: '',
    gender: '',
    ethnicity: '',
    date_of_death: '',
    time_of_death: '',
    date_found: '',
    time_found: '',
    location_found: '',
    condition_of_body: '',
    clothing_description: '',
    personal_effects: '',
    distinguishing_marks: '',
    preliminary_cause_of_death: '',
    official_cause_of_death: '',
    fingerprint_hash: '',
    dental_records_ref: '',
    dna_sample_id: '',
    mortuary_id: '',
    date_admitted: '',
    location_admitted: '',
    identification_status: 'unidentified' as const,
    disposition_status: 'awaiting_release' as const,
    is_public_viewable: false
  })

  const [mediaFiles, setMediaFiles] = useState<{
    photos: File[]
    videos: File[]
    documents: File[]
  }>({
    photos: [],
    videos: [],
    documents: []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const recordData: Partial<DeceasedRecord> = {
        ...formData,
        estimated_age: formData.estimated_age ? parseInt(formData.estimated_age) : null,
        date_of_birth: formData.date_of_birth || null,
        time_of_death: formData.time_of_death || null,
        date_found: formData.date_found || null,
        time_found: formData.time_found || null,
        date_admitted: formData.date_admitted || null,
        assigned_staff_id: user.id,
        created_by: user.id
      }

      const { data, error } = await createDeceasedRecord(recordData)
      
      if (error) {
        console.error('Error creating record:', error)
        return
      }

      // TODO: Handle media file uploads to Supabase Storage
      // This would involve uploading files and linking them to the record

      onSuccess()
      onClose()
      resetForm()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      full_name: '',
      date_of_birth: '',
      estimated_age: '',
      gender: '',
      ethnicity: '',
      date_of_death: '',
      time_of_death: '',
      date_found: '',
      time_found: '',
      location_found: '',
      condition_of_body: '',
      clothing_description: '',
      personal_effects: '',
      distinguishing_marks: '',
      preliminary_cause_of_death: '',
      official_cause_of_death: '',
      fingerprint_hash: '',
      dental_records_ref: '',
      dna_sample_id: '',
      mortuary_id: '',
      date_admitted: '',
      location_admitted: '',
      identification_status: 'unidentified',
      disposition_status: 'awaiting_release',
      is_public_viewable: false
    })
    setMediaFiles({ photos: [], videos: [], documents: [] })
  }

  const handleFileUpload = (type: 'photos' | 'videos' | 'documents', files: FileList | null) => {
    if (!files) return
    
    const newFiles = Array.from(files)
    setMediaFiles(prev => ({
      ...prev,
      [type]: [...prev[type], ...newFiles]
    }))
  }

  const removeFile = (type: 'photos' | 'videos' | 'documents', index: number) => {
    setMediaFiles(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--theme-border)]/20 sticky top-0 bg-[var(--theme-surface)]">
          <h2 className="text-2xl font-bold text-[var(--theme-text)]">Add New Deceased Record</h2>
          <button
            onClick={onClose}
            className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[var(--theme-text)] flex items-center space-x-2">
              <User className="w-5 h-5 text-[var(--theme-accent)]" />
              <span>Personal Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Estimated Age
                </label>
                <input
                  type="number"
                  value={formData.estimated_age}
                  onChange={(e) => setFormData({ ...formData, estimated_age: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                  placeholder="Age in years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Ethnicity
                </label>
                <input
                  type="text"
                  value={formData.ethnicity}
                  onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                  placeholder="Ethnicity"
                />
              </div>
            </div>
          </div>

          {/* Discovery Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[var(--theme-text)] flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-[var(--theme-accent)]" />
              <span>Discovery Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Date of Death *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date_of_death}
                  onChange={(e) => setFormData({ ...formData, date_of_death: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Time of Death
                </label>
                <input
                  type="time"
                  value={formData.time_of_death}
                  onChange={(e) => setFormData({ ...formData, time_of_death: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Date Found
                </label>
                <input
                  type="date"
                  value={formData.date_found}
                  onChange={(e) => setFormData({ ...formData, date_found: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Time Found
                </label>
                <input
                  type="time"
                  value={formData.time_found}
                  onChange={(e) => setFormData({ ...formData, time_found: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Location Found *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location_found}
                  onChange={(e) => setFormData({ ...formData, location_found: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                  placeholder="Detailed location where found"
                />
              </div>
            </div>
          </div>

          {/* Physical Description */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[var(--theme-text)] flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[var(--theme-accent)]" />
              <span>Physical Description</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Condition of Body
                </label>
                <textarea
                  value={formData.condition_of_body}
                  onChange={(e) => setFormData({ ...formData, condition_of_body: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                  placeholder="Describe the condition of the body"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Clothing Description
                </label>
                <textarea
                  value={formData.clothing_description}
                  onChange={(e) => setFormData({ ...formData, clothing_description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                  placeholder="Describe clothing and accessories"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Personal Effects
                </label>
                <textarea
                  value={formData.personal_effects}
                  onChange={(e) => setFormData({ ...formData, personal_effects: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                  placeholder="List personal items found"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Distinguishing Marks
                </label>
                <textarea
                  value={formData.distinguishing_marks}
                  onChange={(e) => setFormData({ ...formData, distinguishing_marks: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                  placeholder="Scars, tattoos, birthmarks, etc."
                />
              </div>
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[var(--theme-text)] flex items-center space-x-2">
              <Upload className="w-5 h-5 text-[var(--theme-accent)]" />
              <span>Media Attachments</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Photos */}
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Photos
                </label>
                <div className="border-2 border-dashed border-[var(--theme-border)]/30 rounded-lg p-4 text-center hover:border-[var(--theme-accent)]/50 transition-colors">
                  <Camera className="w-8 h-8 text-[var(--theme-text-muted)] mx-auto mb-2" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload('photos', e.target.files)}
                    className="hidden"
                    id="photos-upload"
                  />
                  <label htmlFor="photos-upload" className="cursor-pointer text-[var(--theme-accent)] hover:underline">
                    Upload Photos
                  </label>
                  <p className="text-xs text-[var(--theme-text-muted)] mt-1">
                    {mediaFiles.photos.length} file(s) selected
                  </p>
                </div>
              </div>

              {/* Videos */}
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Videos
                </label>
                <div className="border-2 border-dashed border-[var(--theme-border)]/30 rounded-lg p-4 text-center hover:border-[var(--theme-accent)]/50 transition-colors">
                  <Video className="w-8 h-8 text-[var(--theme-text-muted)] mx-auto mb-2" />
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={(e) => handleFileUpload('videos', e.target.files)}
                    className="hidden"
                    id="videos-upload"
                  />
                  <label htmlFor="videos-upload" className="cursor-pointer text-[var(--theme-accent)] hover:underline">
                    Upload Videos
                  </label>
                  <p className="text-xs text-[var(--theme-text-muted)] mt-1">
                    {mediaFiles.videos.length} file(s) selected
                  </p>
                </div>
              </div>

              {/* Documents */}
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Documents
                </label>
                <div className="border-2 border-dashed border-[var(--theme-border)]/30 rounded-lg p-4 text-center hover:border-[var(--theme-accent)]/50 transition-colors">
                  <FileText className="w-8 h-8 text-[var(--theme-text-muted)] mx-auto mb-2" />
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileUpload('documents', e.target.files)}
                    className="hidden"
                    id="documents-upload"
                  />
                  <label htmlFor="documents-upload" className="cursor-pointer text-[var(--theme-accent)] hover:underline">
                    Upload Documents
                  </label>
                  <p className="text-xs text-[var(--theme-text-muted)] mt-1">
                    {mediaFiles.documents.length} file(s) selected
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[var(--theme-text)]">Status & Visibility</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Identification Status
                </label>
                <select
                  value={formData.identification_status}
                  onChange={(e) => setFormData({ ...formData, identification_status: e.target.value as any })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                >
                  <option value="unidentified">Unidentified</option>
                  <option value="pending_confirmation">Pending Confirmation</option>
                  <option value="identified">Identified</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Disposition Status
                </label>
                <select
                  value={formData.disposition_status}
                  onChange={(e) => setFormData({ ...formData, disposition_status: e.target.value as any })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                >
                  <option value="awaiting_release">Awaiting Release</option>
                  <option value="released">Released</option>
                  <option value="buried">Buried</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 pt-8">
                <input
                  type="checkbox"
                  id="public-viewable"
                  checked={formData.is_public_viewable}
                  onChange={(e) => setFormData({ ...formData, is_public_viewable: e.target.checked })}
                  className="w-4 h-4 text-[var(--theme-accent)] bg-[var(--theme-background)] border-[var(--theme-border)] rounded focus:ring-[var(--theme-accent)]"
                />
                <label htmlFor="public-viewable" className="text-sm font-medium text-[var(--theme-text)]">
                  Make publicly viewable
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-[var(--theme-border)]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-[var(--theme-border)]/30 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/80 text-[var(--theme-background)] font-semibold rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DeceasedRecordForm