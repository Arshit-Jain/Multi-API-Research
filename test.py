#!/usr/bin/env python3
"""
Deep Research CLI Tool
A command-line tool for comprehensive research using Gemini API
"""

import os
import json
import time
import argparse
from datetime import datetime
from typing import List, Dict
import requests


class DeepResearch:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        self.model = "gemini-2.0-flash-exp"
        
    def _call_gemini(self, prompt: str, max_tokens: int = 2048, temperature: float = 0.7) -> str:
        """Make a call to Gemini API"""
        url = f"{self.base_url}/{self.model}:generateContent?key={self.api_key}"
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens
            }
        }
        
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
    
    def generate_research_plan(self, query: str) -> List[str]:
        """Generate a research plan with specific questions"""
        print("\n🔍 Generating research plan...")
        
        prompt = f"""You are a research planning assistant. Given this query: "{query}"

Generate a comprehensive research plan with 5-7 specific research questions that need to be answered.
Format your response as a JSON array of strings, where each string is a focused research question.

Example format:
["What is the current market size?", "Who are the key competitors?", ...]

Only respond with the JSON array, nothing else."""
        
        response = self._call_gemini(prompt)
        
        # Extract JSON array from response
        try:
            # Find JSON array in the response
            start = response.find('[')
            end = response.rfind(']') + 1
            json_str = response[start:end]
            questions = json.loads(json_str)
            return questions
        except (json.JSONDecodeError, ValueError):
            # Fallback: split by newlines and clean up
            lines = [line.strip() for line in response.split('\n') if line.strip()]
            return [line.lstrip('0123456789.-) ') for line in lines if len(line) > 10][:7]
    
    def research_question(self, question: str) -> str:
        """Research a specific question"""
        prompt = f"""Research question: "{question}"

Provide a comprehensive answer based on general knowledge. Include:
1. Key facts and data points
2. Multiple perspectives
3. Recent trends or developments
4. Relevant examples

Be thorough and cite general knowledge sources."""
        
        return self._call_gemini(prompt, max_tokens=2048, temperature=0.8)
    
    def synthesize_report(self, query: str, findings: List[Dict[str, str]]) -> str:
        """Synthesize all findings into a final report"""
        print("\n📝 Synthesizing final report...")
        
        findings_text = "\n\n".join([
            f"Question {i+1}: {f['question']}\n\nFindings:\n{f['answer']}\n---"
            for i, f in enumerate(findings)
        ])
        
        prompt = f"""Original research query: "{query}"

Research findings:
{findings_text}

Synthesize these findings into a comprehensive research report with:
1. Executive Summary
2. Key Findings (organized by theme)
3. Detailed Analysis
4. Conclusions and Recommendations

Use markdown formatting for structure."""
        
        return self._call_gemini(prompt, max_tokens=8192, temperature=0.7)
    
    def conduct_research(self, query: str, output_file: str = None) -> str:
        """Conduct complete research on a query"""
        print(f"\n{'='*80}")
        print(f"🔬 Starting Deep Research")
        print(f"Query: {query}")
        print(f"{'='*80}")
        
        # Generate research plan
        questions = self.generate_research_plan(query)
        
        print(f"\n📋 Research Plan ({len(questions)} questions):")
        for i, q in enumerate(questions, 1):
            print(f"  {i}. {q}")
        
        # Research each question
        findings = []
        for i, question in enumerate(questions, 1):
            print(f"\n⏳ Researching question {i}/{len(questions)}...")
            print(f"   {question}")
            
            answer = self.research_question(question)
            findings.append({
                "question": question,
                "answer": answer
            })
            
            # Small delay to avoid rate limits
            time.sleep(1)
        
        # Generate final report
        report = self.synthesize_report(query, findings)
        
        # Add metadata
        full_report = f"""# Deep Research Report
**Query:** {query}
**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Questions Researched:** {len(questions)}

---

{report}

---

## Research Details

"""
        
        for i, finding in enumerate(findings, 1):
            full_report += f"\n### Question {i}: {finding['question']}\n\n{finding['answer']}\n\n"
        
        # Save to file if specified
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(full_report)
            print(f"\n✅ Report saved to: {output_file}")
        
        print("\n" + "="*80)
        print("✨ Research Complete!")
        print("="*80 + "\n")
        
        return full_report


def main():
    parser = argparse.ArgumentParser(
        description='Deep Research CLI - Comprehensive research using Gemini API',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s "Impact of AI on healthcare"
  %(prog)s "Compare electric vs hydrogen vehicles" -o report.md
  %(prog)s "Future of quantum computing" --api-key YOUR_KEY
  
Get your API key at: https://aistudio.google.com/apikey
        """
    )
    
    parser.add_argument(
        'query',
        type=str,
        help='Research query or question'
    )
    
    parser.add_argument(
        '-o', '--output',
        type=str,
        help='Output file path for the report (default: research_report_TIMESTAMP.md)'
    )
    
    parser.add_argument(
        '-k', '--api-key',
        type=str,
        help='Gemini API key (or set GEMINI_API_KEY environment variable)'
    )
    
    parser.add_argument(
        '--show-report',
        action='store_true',
        help='Print the full report to console'
    )
    
    args = parser.parse_args()
    
    # Get API key
    api_key = args.api_key or os.environ.get('GEMINI_API_KEY')
    
    if not api_key:
        print("❌ Error: Gemini API key not found!")
        print("\nProvide your API key using one of these methods:")
        print("  1. Command line: --api-key YOUR_KEY")
        print("  2. Environment variable: export GEMINI_API_KEY=YOUR_KEY")
        print("\nGet your API key at: https://aistudio.google.com/apikey")
        return 1
    
    # Set default output file
    if not args.output:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        args.output = f"research_report_{timestamp}.md"
    
    try:
        # Initialize and run research
        researcher = DeepResearch(api_key)
        report = researcher.conduct_research(args.query, args.output)
        
        # Print report if requested
        if args.show_report:
            print("\n" + "="*80)
            print("FULL REPORT")
            print("="*80 + "\n")
            print(report)
        
        return 0
        
    except requests.exceptions.HTTPError as e:
        print(f"\n❌ API Error: {e}")
        if e.response.status_code == 401:
            print("Invalid API key. Get a valid key at: https://aistudio.google.com/apikey")
        elif e.response.status_code == 429:
            print("Rate limit exceeded. Please wait a moment and try again.")
        return 1
    except KeyboardInterrupt:
        print("\n\n⚠️  Research interrupted by user.")
        return 130
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return 1


if __name__ == "__main__":
    exit(main())