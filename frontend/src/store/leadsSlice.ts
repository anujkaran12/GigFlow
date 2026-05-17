import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import {
  createLead as createLeadRequest,
  deleteLead as deleteLeadRequest,
  getLead,
  getLeads,
  updateLead as updateLeadRequest,
} from '../services/lead.service'
import type {
  ApiErrorResponse,
  FilterParams,
  Lead,
  LeadFormValues,
  LeadsResponse,
  PaginationMeta,
} from '../types'

const defaultMeta: PaginationMeta = {
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  limit: 10,
}

const defaultFilters: FilterParams = {
  search: '',
  status: '',
  source: '',
  sort: 'latest',
  page: 1,
}

interface LeadsState {
  leads: Lead[]
  selectedLead: Lead | null
  pagination: PaginationMeta
  filters: FilterParams
  loading: boolean
  detailLoading: boolean
  saving: boolean
  error: string | null
}

interface UpdateLeadPayload {
  id: string
  values: LeadFormValues
}

const initialState: LeadsState = {
  leads: [],
  selectedLead: null,
  pagination: defaultMeta,
  filters: defaultFilters,
  loading: false,
  detailLoading: false,
  saving: false,
  error: null,
}

export const fetchLeads = createAsyncThunk<
  LeadsResponse,
  FilterParams,
  { rejectValue: string }
>('leads/fetchLeads', async (filters, { rejectWithValue }) => {
  try {
    return await getLeads(filters)
  } catch (error) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      return rejectWithValue(error.response?.data?.message ?? error.message)
    }

    return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong')
  }
})

export const fetchLeadById = createAsyncThunk<Lead, string, { rejectValue: string }>(
  'leads/fetchLeadById',
  async (id, { rejectWithValue }) => {
    try {
      return await getLead(id)
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return rejectWithValue(error.response?.data?.message ?? error.message)
      }

      return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong')
    }
  },
)

export const createLead = createAsyncThunk<Lead, LeadFormValues, { rejectValue: string }>(
  'leads/createLead',
  async (values, { rejectWithValue }) => {
    try {
      return await createLeadRequest(values)
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return rejectWithValue(error.response?.data?.message ?? error.message)
      }

      return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong')
    }
  },
)

export const updateLead = createAsyncThunk<Lead, UpdateLeadPayload, { rejectValue: string }>(
  'leads/updateLead',
  async ({ id, values }, { rejectWithValue }) => {
    try {
      return await updateLeadRequest(id, values)
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return rejectWithValue(error.response?.data?.message ?? error.message)
      }

      return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong')
    }
  },
)

export const deleteLead = createAsyncThunk<string, string, { rejectValue: string }>(
  'leads/deleteLead',
  async (id, { rejectWithValue }) => {
    try {
      await deleteLeadRequest(id)
      return id
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return rejectWithValue(error.response?.data?.message ?? error.message)
      }

      return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong')
    }
  },
)

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FilterParams>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false
        state.leads = action.payload.data
        state.pagination = action.payload.meta
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to load leads'
      })
      .addCase(fetchLeadById.pending, (state) => {
        state.detailLoading = true
        state.error = null
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.detailLoading = false
        state.selectedLead = action.payload
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.detailLoading = false
        state.error = action.payload ?? 'Failed to load lead'
      })
      .addCase(createLead.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(createLead.fulfilled, (state) => {
        state.saving = false
      })
      .addCase(createLead.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload ?? 'Failed to create lead'
      })
      .addCase(updateLead.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.saving = false
        state.leads = state.leads.map((lead) =>
          lead.id === action.payload.id ? action.payload : lead,
        )
        state.selectedLead = action.payload
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload ?? 'Failed to update lead'
      })
      .addCase(deleteLead.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.saving = false
        state.leads = state.leads.filter((lead) => lead.id !== action.payload)
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload ?? 'Failed to delete lead'
      })
  },
})

export const { setFilters } = leadsSlice.actions
export default leadsSlice.reducer
