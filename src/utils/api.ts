import { supabase } from './supabase/client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return {
        'Authorization': `Bearer ${session.access_token}`
      };
    }
  } catch (err) {
    console.warn('[API] Could not retrieve session for auth header:', err);
  }
  return {
    'Authorization': 'Bearer guest_demo_token'
  };
}

export interface ChatRequestPayload {
  query: string;
  activeMemberId: string;
  familyMembers: any[];
  conversationHistory?: any[];
}

export interface ChatResponsePayload {
  reply: string;
  clinicalCards?: any[];
  targetMemberId?: string;
  status: string;
}

export interface DocumentProcessResponse {
  status: string;
  data: {
    title: string;
    category: string;
    hospital: string;
    doctor: string;
    date: string;
    summary: string;
    extractedData: {
      diseases: string[];
      medications: string[];
      values: Record<string, string>;
    };
    fileSize: string;
    fileType: string;
    rawText?: string;
    timelineEvent?: any;
  };
}

export interface EmergencySummaryPayload {
  member: any;
  recentReports?: any[];
  timelineEvents?: any[];
}

export const pythonAI = {
  /**
   * Send conversational health query to Python Gemini / RAG Agent
   */
  async chat(payload: ChatRequestPayload): Promise<ChatResponsePayload> {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`AI Chat request failed with status ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Send uploaded PDF/Image to Python OCR and Structured Entity Extractor
   */
  async processDocument(file: File, memberId: string): Promise<DocumentProcessResponse> {
    const authHeaders = await getAuthHeaders();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('memberId', memberId);

    const response = await fetch(`${API_BASE_URL}/documents/process`, {
      method: 'POST',
      headers: {
        ...authHeaders
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Document processing failed with status ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Request Python Emergency Agent to synthesize medical card
   */
  async generateEmergencySummary(payload: EmergencySummaryPayload): Promise<any> {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/ai/emergency-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Emergency summary request failed with status ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Health diagnostic check
   */
  async checkHealth(): Promise<{ status: string; service: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  }
};
