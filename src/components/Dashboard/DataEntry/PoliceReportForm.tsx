import React, { useState, useEffect } from 'react'
import { Shield, Calendar, MapPin, FileText, Upload, Camera, Video, Save, X, Search } from 'lucide-react'
import { createPoliceReport, PoliceReport, DeceasedRecord, supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

interface PoliceReportFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const PoliceReportForm: React.FC<PoliceReportFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [deceasedRecords, setDeceasedRecords] = useState<DeceasedRecord[]>([])
  const [formData, setFormData] = useState({
    case_id: '',
    deceased_record_id: '',
    date_of_report: new Date().toISOString().split('T')[0],
    time_of_report: new Date().toTimeString().slice(0, 5),
    jurisdiction: '',
    circumstances_of_discovery: '',
    evidence_collected: '',
    fingerprint_match_status: 'pending' as const,
    dna_match_status: '',
    dental_match_status: '',
    officer_notes: '',
    crime_type: '',
    accident_type: '',
    report_status: 'draft' as const
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

  useEffect(() => {
    if (isOpen) {
      fetchDeceasedRecords()
      generateCaseId()
    }
  }, [isOpen])

  const fetchDeceasedRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('deceased_records')
        .select('id, full_name, date_of_death, location_found')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching deceased records:', error)
        return
      }

      setDeceasedRecords(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const generateCaseId = () => {
    const year = new Date().getFullYear()
    const timestamp = Date.now().toString().slice(-6)
    setFormData(prev => ({
      ...prev,
      case_id: `CASE-${year}-${timestamp}`
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const reportData: Partial<PoliceReport> = {
        ...formData,
        reporting_officer_id: user.id
      }

      const { data, error } = await createPoliceReport(reportData)
      
      if (error) {
        console.error('Error creating report:', error)
        return
      }

      // TODO: Handle media file uploads to Supabase Storage

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
      case_id: '',
      deceased_record_id: '',
      date_of_report: new Date().toISOString().split('T')[0],
      time_of_report: new Date().toTimeString().slice(0, 5),
      jurisdiction: '',
      circumstances_of_discovery: '',
      evidence_collected: '',
      fingerprint_match_status: 'pending',
      dna_match_status: '',
      dental_match_status: '',
      officer_notes: '',
      crime_type: '',
      accident_type: '',
      report_status: 'draft'
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--theme-border)]/20 sticky top-0 bg-[var(--theme-surface)]">
          <h2 className="text-2xl font-bold text-[var(--theme-text)] flex items-center space-x-2">
            <Shield className="w-6 h-6 text-[var(--theme-accent)]" />
            <span>New Police Report</span>
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Report Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[var(--theme-text)] flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[var(--theme-accent)]" />
              <span>Report Details</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Case ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.case_id}
                  onChange={(e) => setFormData({ ...formData, case_id: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Jurisdiction *
                </label>
                <input
                  type="text"
                  required
                  value={formData.jurisdiction}
                  onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                  placeholder="Police jurisdiction"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Date of Report *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date_of_report}
                  onChange={(e) => setFormData({ ...formData, date_of_report: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Time of Report *
                </label>
                <input
                  type="time"
                  required
                  value={formData.time_of_report}
                  onChange={(e) => setFormData({ ...formData, time_of_report: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Associated Deceased Record */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[var(--theme-text)] flex items-center space-x-2">
              <Search className="w-5 h-5 text-[var(--theme-accent)]" />
              <span>Associated Deceased Record</span>
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                Select Deceased Record *
              </label>
              <select
                required
                value={formData.deceased_record_id}
                onChange={(e) => setFormData({ ...formData, deceased_record_id: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
              >
                <option value="">Select a deceased record</option>
                {deceasedRecords.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.full_name} - {record.location_found} ({new Date(record.date_of_death).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Investigation Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[var(--theme-text)]">Investigation Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Circumstances of Discovery *
                </label>
                <textarea
                  required
                  value={formData.circumstances_of_discovery}
                  onChange={(e) => setFormData({ ...formData, circumstances_of_discovery: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                  placeholder="Detailed description of how the body was discovered"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Evidence Collected
                </label>
                <textarea
                  value={formData.evidence_collected}
                  onChange={(e) => setFormData({ ...formData, evidence_collected: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                  placeholder="List of evidence collected at the scene"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Officer Notes
                </label>
                <textarea
                  value={formData.officer_notes}
                  onChange={(e) => setFormData({ ...formData, officer_notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                  placeholder="Additional observations and notes"
                />
              </div>
            </div>
          </div>

          {/* Forensic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[var(--theme-text)]">Forensic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Fingerprint Match Status
                </label>
                <select
                  value={formData.fingerprint_match_status}
                  onChange={(e) => setFormData({ ...formData, fingerprint_match_status: e.target.value as any })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                >
                  <option value="pending">Pending</option>
                  <option value="matched">Matched</option>
                  <option value="no_match">No Match</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  DNA Match Status
                </label>
                <input
                  type="text"
                  value={formData.dna_match_status}
                  onChange={(e) => setFormData({ ...formData, dna_match_status: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                  placeholder="DNA analysis status"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Dental Match Status
                </label>
                <input
                  type="text"
                  value={formData.dental_match_status}
                  onChange={(e) => setFormData({ ...formData, dental_match_status: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                  placeholder="Dental records status"
                />
              </div>
            </div>
          </div>

          {/* Incident Classification */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[var(--theme-text)]">Incident Classification</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Crime Type
                </label>
                <select
                  value={formData.crime_type}
                  onChange={(e) => setFormData({ ...formData, crime_type: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                >
                  <option value="">Select crime type</option>
                  <option value="homicide">Homicide</option>
                  <option value="suspicious_death">Suspicious Death</option>
                  <option value="natural_death">Natural Death</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Accident Type
                </label>
                <select
                  value={formData.accident_type}
                  onChange={(e) => setFormData({ ...formData, accident_type: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                >
                  <option value="">Select accident type</option>
                  <option value="vehicle_accident">Vehicle Accident</option>
                  <option value="drowning">Drowning</option>
                  <option value="fall">Fall</option>
                  <option value="fire">Fire</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Evidence Upload Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[var(--theme-text)] flex items-center space-x-2">
              <Upload className="w-5 h-5 text-[var(--theme-accent)]" />
              <span>Evidence Attachments</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Photos */}
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Crime Scene Photos
                </label>
                <div className="border-2 border-dashed border-[var(--theme-border)]/30 rounded-lg p-4 text-center hover:border-[var(--theme-accent)]/50 transition-colors">
                  <Camera className="w-8 h-8 text-[var(--theme-text-muted)] mx-auto mb-2" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload('photos', e.target.files)}
                    className="hidden"
                    id="evidence-photos-upload"
                  />
                  <label htmlFor="evidence-photos-upload" className="cursor-pointer text-[var(--theme-accent)] hover:underline">
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
                  Video Evidence
                </label>
                <div className="border-2 border-dashed border-[var(--theme-border)]/30 rounded-lg p-4 text-center hover:border-[var(--theme-accent)]/50 transition-colors">
                  <Video className="w-8 h-8 text-[var(--theme-text-muted)] mx-auto mb-2" />
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={(e) => handleFileUpload('videos', e.target.files)}
                    className="hidden"
                    id="evidence-videos-upload"
                  />
                  <label htmlFor="evidence-videos-upload" className="cursor-pointer text-[var(--theme-accent)] hover:underline">
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
                  Reports & Documents
                </label>
                <div className="border-2 border-dashed border-[var(--theme-border)]/30 rounded-lg p-4 text-center hover:border-[var(--theme-accent)]/50 transition-colors">
                  <FileText className="w-8 h-8 text-[var(--theme-text-muted)] mx-auto mb-2" />
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileUpload('documents', e.target.files)}
                    className="hidden"
                    id="evidence-documents-upload"
                  />
                  <label htmlFor="evidence-documents-upload" className="cursor-pointer text-[var(--theme-accent)] hover:underline">
                    Upload Documents
                  </label>
                  <p className="text-xs text-[var(--theme-text-muted)] mt-1">
                    {mediaFiles.documents.length} file(s) selected
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Report Status */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[var(--theme-text)]">Report Status</h3>
            
            <div>
              <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                Status
              </label>
              <select
                value={formData.report_status}
                onChange={(e) => setFormData({ ...formData, report_status: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--theme-background)] border border-[var(--theme-border)]/30 rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
              >
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="closed">Closed</option>
              </select>
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
              <span>{loading ? 'Saving...' : 'Save Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PoliceReportForm