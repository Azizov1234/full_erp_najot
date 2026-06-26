import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, MenuItem, Select, FormControl
} from '@mui/material';
import api from '../api/axios';

const UZ_MONTHS = [
  'Iyun', 'Iyun', 'Iyun', 'Iyun', 'Iyun', 'Iyun',
  'Iyun', 'Iyun', 'Iyun', 'Iyun', 'Iyun', 'Iyun'
];

// Sana formatlash: "23 Iyun, 2026"
function formatLessonDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  // O'zbekcha oylar ro'yxati
  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];
  return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
}

// Deadline formatlash: "24 Iyun, 2026 12:30"
function formatDeadline(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  // Sanaga 20 soat qo'shish
  d.setHours(d.getHours() + 20);

  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month}, ${year} ${hh}:${mm}`;
}

// Uy vazifasi holati config
const HW_STATUS = {
  ACCEPTED: { label: 'Qabul qilingan', bg: '#48c062', color: '#fff' },
  PENDING: { label: 'Kutayotganlar', bg: '#5970ee', color: '#fff' },
  RETURNED: { label: 'Qaytarilgan', bg: '#f1aa17', color: '#fff' },
  NOT_DONE: { label: 'Bajarilmagan', bg: '#eb341d', color: '#fff' },
  NONE: { label: 'Berilmagan', bg: '#606870', color: '#fff' },
};

const STATUS_OPTIONS = [
  { value: 'ALL',      label: 'Barchasi' },
  { value: 'ACCEPTED', label: 'Qabul qilingan' },
  { value: 'NONE',     label: 'Berilmagan' },
  { value: 'RETURNED', label: 'Qaytarilgan' },
  { value: 'NOT_DONE', label: 'Bajarilmagan' },
  { value: 'PENDING',  label: 'Kutayotganlar' },
];

const DROPDOWN_COLORS = {
  ALL: { bg: '#ffffff', color: '#1e293b', hoverBg: '#faede0' },
  ACCEPTED: { bg: '#48c062', color: '#ffffff', hoverBg: '#3da552' },
  NONE: { bg: '#606870', color: '#ffffff', hoverBg: '#505860' },
  RETURNED: { bg: '#f1aa17', color: '#ffffff', hoverBg: '#d99710' },
  NOT_DONE: { bg: '#eb341d', color: '#ffffff', hoverBg: '#cf2d18' },
  PENDING: { bg: '#5970ee', color: '#ffffff', hoverBg: '#445be0' },
};

export default function StudentGroupLessons() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    setLoading(true);
    api.get(`/api/v1/students/my/groups/${groupId}/lessons-summary`)
      .then(res => {
        setLessons(res.data?.data || []);
      })
      .catch(err => {
        console.error('API error while fetching group lessons:', err);
        setLessons([]);
      })
      .finally(() => setLoading(false));
  }, [groupId]);

  // Yangi API to'g'ridan-to'g'ri homeworkStatus qaytaradi
  const getHwStatusKey = (lesson) => lesson.homeworkStatus || 'NONE';

  // Filter lessons
  const filtered = lessons.filter(lesson => {
    if (filter === 'ALL') return true;
    return getHwStatusKey(lesson) === filter;
  });

  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-out', pt: 0.5, px: 1 }}>
      {/* Title "Uy vazifasi statusi" */}
      <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', mb: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Uy vazifa statusi
      </Typography>

      {/* Filter bar */}
      <Box sx={{ mb: 3.5 }}>
        <FormControl size="small">
          <Select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            renderValue={(selected) => {
              const opt = STATUS_OPTIONS.find(o => o.value === selected);
              return opt ? opt.label : selected;
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: '12px',
                  p: 0.5,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0'
                }
              }
            }}
            sx={{
              minWidth: 200,
              backgroundColor: '#fff',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: '#1e293b',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0', borderWidth: 1.5 },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#c5a059' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#c5a059', borderWidth: 1.5 },
            }}
          >
            {STATUS_OPTIONS.map(opt => {
              const colors = DROPDOWN_COLORS[opt.value] || DROPDOWN_COLORS.ALL;
              return (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                  sx={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    backgroundColor: colors.bg,
                    color: colors.color,
                    borderRadius: '8px',
                    my: 0.3,
                    mx: 0.4,
                    py: 1,
                    transition: 'all 0.15s',
                    '&:hover': {
                      backgroundColor: colors.hoverBg,
                      color: colors.value === 'ALL' ? '#c5a059' : '#ffffff',
                    },
                    '&.Mui-selected': {
                      backgroundColor: colors.hoverBg,
                      color: colors.value === 'ALL' ? '#c5a059' : '#ffffff',
                      fontWeight: 700,
                      '&:hover': {
                        backgroundColor: colors.hoverBg,
                      }
                    }
                  }}
                >
                  {opt.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>

      {/* Table grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#c5a059' }} />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <Typography sx={{ color: '#94a3b8', fontWeight: 600 }}>Darslar mavjud emas</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.015)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#ffffff' }}>
              <TableRow sx={{ '& th': { borderBottom: '1.5px solid #e2e8f0' } }}>
                <TableCell sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.875rem', py: 2.2, px: 3, whiteSpace: 'nowrap' }}>Mavzular</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.875rem', py: 2.2, px: 3, whiteSpace: 'nowrap' }}>Video</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.875rem', py: 2.2, px: 3, whiteSpace: 'nowrap' }}>Uyga vazifa Holati</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.875rem', py: 2.2, px: 3, whiteSpace: 'nowrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, whiteSpace: 'nowrap' }}>
                    Uyga vazifa tugash vaqti
                    <Box component="span" sx={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', ml: 0.5 }}>↓</Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.875rem', py: 2.2, px: 3, whiteSpace: 'nowrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, whiteSpace: 'nowrap' }}>
                    Dars sanasi
                    <Box component="span" sx={{ fontWeight: 800, fontSize: '1rem', color: '#22c55e', ml: 0.5 }}>↑</Box>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((lesson, idx) => {
                const videoCount = lesson.videoCount ?? 0;
                const statusKey = getHwStatusKey(lesson);
                const isExam = lesson.topic?.toLowerCase().includes('exam') || lesson.topic?.toLowerCase().includes('imtihon');

                return (
                  <TableRow
                    key={lesson.id}
                    onClick={() => navigate(`/student/groups/${groupId}/lessons/${lesson.id}`)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#fdfaf5' },
                      '& td': { borderBottom: idx === filtered.length - 1 ? 'none' : '1px solid #f1f5f9', py: 2.2, px: 3 },
                      transition: 'background 0.2s',
                    }}
                  >
                    {/* Mavzu */}
                    <TableCell>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {lesson.topic || lesson.description || `Dars #${idx + 1}`}
                      </Typography>
                    </TableCell>

                    {/* Video count circle blue badge or Imtihon gold badge */}
                    <TableCell>
                      {isExam ? (
                        <Box sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          px: 1.5, py: 0.4,
                          borderRadius: '12px',
                          backgroundColor: '#faede0',
                          color: '#c5a059',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          boxShadow: '0 1px 3px rgba(197,160,89,0.1)'
                        }}>
                          Imtihon
                        </Box>
                      ) : (
                        <Box sx={{
                          width: 24, height: 24, borderRadius: '50%',
                          border: '1.5px solid #2196f3',
                          color: '#2196f3', fontSize: '0.78rem', fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {videoCount}
                        </Box>
                      )}
                    </TableCell>

                    {/* Status Pill Badge */}
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 2, py: 0.5,
                        borderRadius: '20px',
                        backgroundColor: HW_STATUS[statusKey]?.bg || '#606870',
                      }}>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: HW_STATUS[statusKey]?.color || '#fff', whiteSpace: 'nowrap' }}>
                          {HW_STATUS[statusKey]?.label || 'Berilmagan'}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Deadline */}
                    <TableCell sx={{ fontSize: '0.88rem', color: '#475569', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: 'nowrap' }}>
                      {formatDeadline(lesson.homeworkCreatedAt)}
                    </TableCell>

                    {/* Date */}
                    <TableCell sx={{ fontSize: '0.88rem', color: '#475569', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: 'nowrap' }}>
                      {formatLessonDate(lesson.date)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
