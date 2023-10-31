import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as ace from 'ace-builds';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  template: any = { htmlContent: '' };
  pdfUrl: SafeResourceUrl;
  editorContentChange$ = new Subject<string>();

  @ViewChild('editor', { static: false })
  editorDiv!: ElementRef;

  editor!: ace.Ace.Editor;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');

    // Debounce the editor changes by 1000ms (1 second)
    this.editorContentChange$.pipe(debounceTime(1000)).subscribe(content => {
      this.generatePdf();
    });
  }

  ngOnInit(): void {
    this.loadTemplate(1);
  }

  ngAfterViewInit() {
    this.initializeEditor();
  }

  loadTemplate(id: number) {
    this.http.get(`/api/templates/${id}`).subscribe(data => {
      this.template = data;
      this.initializeEditor();
    });
  }

  initializeEditor() {
    if (this.editorDiv && this.editorDiv.nativeElement) {
      this.editor = ace.edit(this.editorDiv.nativeElement);
      this.editor.setTheme('ace/theme/monokai');
      this.editor.session.setMode('ace/mode/html');
      this.editor.on('change', () => {
        const content = this.editor.getValue();
        this.template.htmlContent = content;
        this.editorContentChange$.next(content);
      });
      this.editor.setValue(this.template.htmlContent, 1);
    }
  }

  save() {
    this.http.put(`/api/templates/${this.template.id}`, this.template).subscribe(() => {
      alert('Template updated!');
    });
  }

  generatePdf() {
    this.http.post('api/templates/generate-pdf', { htmlContent: this.template.htmlContent }, { responseType: 'blob' }).subscribe(blob => {
      const objectURL = URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
    });
  }
}
