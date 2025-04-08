'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  Container, Typography, Button, Stack, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl
} from '@mui/material'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import IconButton from '@mui/material/IconButton'
import Image from 'next/image'

// 📦 Helper Functions — kamu bisa pindahkan ke utils bila perlu
const timeStrToMinutes = (str: string) => {
  const [h, m] = str.split(':').map(Number)
  return h * 60 + m
}
const minutesToTimeStr = (m: number) => `${Math.floor(m / 60)}`.padStart(2, '0') + ':' + `${m % 60}`.padStart(2, '0')
const recalcTimesForDay = (list: any[]) => {
  let current = timeStrToMinutes("06:00")
  return list.map(dest => {
    const open = dest.openHour ? timeStrToMinutes(dest.openHour) : 360
    const close = dest.closeHour ? Math.min(timeStrToMinutes(dest.closeHour), 1380) : 1380
    if (current < open) current = open
    if (current > close) current = close
    const time = minutesToTimeStr(current)
    const dur = Math.round(Number(dest.visitDurationHours || 1) * 60)
    current = Math.min(current + dur, close)
    return { ...dest, recommendedVisitTime: time }
  })
}
const groupByDay = (list: any[]) => {
  const grouped: Record<string, any[]> = {}
  list.forEach(d => {
    if (!grouped[d.day]) grouped[d.day] = []
    grouped[d.day].push(d)
  })
  return grouped
}
const recalcAllTimes = (list: any[]) => {
  const grouped = groupByDay(list)
  let result: any[] = []
  Object.keys(grouped)
    .sort((a, b) => parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1]))
    .forEach(day => {
      result = [...result, ...recalcTimesForDay(grouped[day])]
    })
  return result.sort((a, b) => {
    const dayA = parseInt(a.day.split(' ')[1])
    const dayB = parseInt(b.day.split(' ')[1])
    return dayA !== dayB ? dayA - dayB : timeStrToMinutes(a.recommendedVisitTime) - timeStrToMinutes(b.recommendedVisitTime)
  })
}
const generateTimesAndDays = (dest: any[], maxPerDay = 5) => {
  dest.forEach((d, i) => { d.day = `Day ${Math.floor(i / maxPerDay) + 1}` })
  return recalcAllTimes(dest)
}

// 🔥 Main Component
export default function ItineraryDraftPage() {
  const [itineraryTitle, setItineraryTitle] = useState("My Itinerary")
  const [editingTitle, setEditingTitle] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [selected, setSelected] = useState<any[]>([])
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editingTime, setEditingTime] = useState("")
  const [editingDayItem, setEditingDayItem] = useState<any>(null)
  const [newDay, setNewDay] = useState("")
  const [detailItem, setDetailItem] = useState<any>(null)

  const router = useRouter()

  useEffect(() => {
    const data = localStorage.getItem('selectedDestinations')
    if (data) setSelected(generateTimesAndDays(JSON.parse(data)))
  }, [])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [activeMenuDest, setActiveMenuDest] = useState<any>(null)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, dest: any) => {
    setAnchorEl(event.currentTarget)
    setActiveMenuDest(dest)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setActiveMenuDest(null)
  }


  const grouped = groupByDay(selected)
  const days = Object.keys(grouped).sort((a, b) => parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1]))
  const nextDay = `Day ${Math.max(...days.map(d => parseInt(d.split(' ')[1])), 0) + 1}`

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    const sourceDay = result.source.droppableId
    const destDay = result.destination.droppableId
    const sourceList = Array.from(grouped[sourceDay])
    const [item] = sourceList.splice(result.source.index, 1)
    item.day = destDay
    grouped[sourceDay] = sourceList
    grouped[destDay] = [...(grouped[destDay] || []), item]
    const all = recalcAllTimes(Object.values(grouped).flat())
    setSelected(all)
    localStorage.setItem('selectedDestinations', JSON.stringify(all))
  }

  const handleSaveToDB = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const res = await fetch('/api/itineraries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: itineraryTitle,
        userId: user.id,
        destinations: selected.map(({ id, day, recommendedVisitTime }) => ({ id, day, recommendedVisitTime }))
      })
    })
    const data = await res.json()
    alert(data.message)
    router.push('/itineraries')
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text(itineraryTitle, 14, 20)
    let y = 30
    days.forEach(day => {
      doc.setFontSize(14)
      doc.text(day, 14, y)
      y += 6
      autoTable(doc, {
        startY: y,
        head: [['Time', 'Destination', 'Map']],
        body: grouped[day].map(d => [d.recommendedVisitTime, d.name, d.link_gmaps]),
        margin: { left: 14, right: 14 },
        styles: { fontSize: 10 },
      })
      y = (doc as any).lastAutoTable.finalY + 10
    })
    doc.save(`${itineraryTitle.replace(/\s+/g, '-')}.pdf`)
  }

  return (
    <main className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <Container className="py-10">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
            <Typography variant="h4">{itineraryTitle}</Typography>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                flexWrap: 'nowrap',
                overflowX: 'auto',
                '& button': {
                  whiteSpace: 'nowrap',
                  minWidth: { xs: 80, sm: 120 },
                  px: { xs: 1, sm: 2 },
                  fontSize: { xs: '0.7rem', sm: '0.875rem' },
                  flexShrink: 0
                }
              }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  setNewTitle(itineraryTitle)
                  setEditingTitle(true)
                }}
              >
                <span className="hidden sm:inline">Edit Title</span>
                <span className="inline sm:hidden">Edit</span>
              </Button>

              <Button variant="outlined" onClick={handleSaveToDB}>
                <span className="hidden sm:inline">Save Itinerary</span>
                <span className="inline sm:hidden">Save</span>
              </Button>

              <Button variant="contained" onClick={handleExportPDF}>
                <span className="hidden sm:inline">Export to PDF</span>
                <span className="inline sm:hidden">Export</span>
              </Button>
            </Stack>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            {days.map(day => (
              <div key={day} className="mb-10">
                <Typography variant="h5" color="primary" gutterBottom>{day}</Typography>
                <Droppable droppableId={day}>
                  {(provided) => (
                    <Timeline ref={provided.innerRef} {...provided.droppableProps}>
                      {grouped[day].map((dest, idx) => (
                        <Draggable key={dest.id} draggableId={dest.id} index={idx}>
                          {(provided) => (
                            <TimelineItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TimelineOppositeContent
                                sx={{
                                  flex: '0 0 auto',
                                  minWidth: '60px',
                                  paddingRight: 2,
                                  marginTop: 0.4
                                }}
                              >
                                <Typography variant="body2">
                                  {dest.recommendedVisitTime}
                                </Typography>
                              </TimelineOppositeContent>

                              <TimelineSeparator>
                                <TimelineDot />
                                {idx < grouped[day].length - 1 && <TimelineConnector />}
                              </TimelineSeparator>

                              <TimelineContent sx={{ flexGrow: 1 }}>
                                <Card sx={{ width: '100%' }}>
                                  <CardContent className="flex gap-4 flex-col sm:flex-row">
                                    <CardMedia
                                      component="img"
                                      image={dest.imageUrl}
                                      alt={dest.name}
                                      sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 2 }}
                                      onClick={() => setDetailItem(dest)}
                                    />
                                    <div className="flex-1">
                                      <Typography variant="h6" onClick={() => setDetailItem(dest)} className="cursor-pointer hover:underline">
                                        {dest.name}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">{dest.city}</Typography>

                                      <div className="mt-2">
                                        <IconButton
                                          size="small"
                                          aria-controls="options-menu"
                                          aria-haspopup="true"
                                          onClick={(e) => handleOpenMenu(e, dest)}
                                        >
                                          <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                          id="options-menu"
                                          anchorEl={anchorEl}
                                          open={Boolean(anchorEl) && activeMenuDest?.id === dest.id}
                                          onClose={handleCloseMenu}
                                        >
                                          <MenuItem onClick={() => {
                                            setDetailItem(dest)
                                            handleCloseMenu()
                                          }}>
                                            Details
                                          </MenuItem>
                                          <MenuItem onClick={() => {
                                            setEditingItem(dest)
                                            setEditingTime(dest.recommendedVisitTime)
                                            handleCloseMenu()
                                          }}>
                                            Edit Time
                                          </MenuItem>
                                          <MenuItem onClick={() => {
                                            setEditingDayItem(dest)
                                            setNewDay(dest.day)
                                            handleCloseMenu()
                                          }}>
                                            Change Day
                                          </MenuItem>
                                          <MenuItem onClick={() => {
                                            const updated = selected.filter(d => d.id !== dest.id)
                                            setSelected(updated)
                                            localStorage.setItem('selectedDestinations', JSON.stringify(updated))
                                            handleCloseMenu()
                                          }}>
                                            Remove
                                          </MenuItem>
                                        </Menu>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TimelineContent>
                            </TimelineItem>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Timeline>
                  )}
                </Droppable>
              </div>
            ))}
          </DragDropContext>

          <Button variant="contained" color="error" onClick={() => {
            if (confirm("Clear all destinations?")) {
              localStorage.removeItem("selectedDestinations")
              setSelected([])
              router.push("/destinations")
            }
          }}>
            Clear All
          </Button>

          {/* Dialogs */}
          <Dialog open={editingTitle} onClose={() => setEditingTitle(false)}>
            <DialogTitle>Edit Title</DialogTitle>
            <DialogContent>
              <TextField fullWidth value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditingTitle(false)}>Cancel</Button>
              <Button onClick={() => { setItineraryTitle(newTitle); setEditingTitle(false) }}>Save</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={!!editingItem} onClose={() => setEditingItem(null)}>
            <DialogTitle>Edit Visit Time</DialogTitle>
            <DialogContent>
              <TextField type="time" fullWidth value={editingTime} onChange={e => setEditingTime(e.target.value)} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditingItem(null)}>Cancel</Button>
              <Button onClick={() => {
                const updated = selected.map(d => d.id === editingItem.id ? { ...d, recommendedVisitTime: editingTime } : d)
                setSelected(recalcAllTimes(updated))
                localStorage.setItem('selectedDestinations', JSON.stringify(updated))
                setEditingItem(null)
              }}>Save</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={!!editingDayItem} onClose={() => setEditingDayItem(null)}>
            <DialogTitle>Change Day</DialogTitle>
            <DialogContent>
              <FormControl fullWidth>
                <Select value={newDay} onChange={e => setNewDay(e.target.value)}>
                  {[...days, nextDay].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditingDayItem(null)}>Cancel</Button>
              <Button onClick={() => {
                const updated = selected.map(d => d.id === editingDayItem.id ? { ...d, day: newDay } : d)
                setSelected(recalcAllTimes(updated))
                localStorage.setItem('selectedDestinations', JSON.stringify(updated))
                setEditingDayItem(null)
              }}>Save</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={!!detailItem} onClose={() => setDetailItem(null)}>
            <DialogTitle>{detailItem?.name}</DialogTitle>
            <DialogContent>
              <div className="relative w-full h-48">
                <Image src={detailItem?.imageUrl} alt={detailItem?.name} fill className="mb-4 rounded" />
              </div>
              <Typography><strong>City:</strong> {detailItem?.city}</Typography>
              <Typography><strong>Description:</strong> {detailItem?.description}</Typography>
              <Typography><strong>Category:</strong> {detailItem?.category}</Typography>
              <Typography><strong>Rating:</strong> {detailItem?.rating}</Typography>
              <Typography><strong>Open:</strong> {detailItem?.openHour} - {detailItem?.closeHour}</Typography>
              <Typography><strong>Ticket:</strong> {detailItem?.hasTicket ? `¥${detailItem.ticketPriceYen}` : 'Free'}</Typography>
              <Typography><strong>For Kids:</strong> {detailItem?.suitableForKids ? 'Yes' : 'No'}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailItem(null)}>Close</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    </main>
  )
}
