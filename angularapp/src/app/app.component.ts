import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as ace from 'ace-builds';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-monokai';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  template: any = { htmlContent: '' };
  pdfUrl: SafeResourceUrl; // For displaying PDF

  @ViewChild('editor', { static: false })
  editorDiv!: ElementRef;

  editor!: ace.Ace.Editor;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
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

      this.editor.session.setOption("useWorker", false);
      this.editor.setOption("enableBasicAutocompletion", true);
      this.editor.setOption("enableSnippets", true);
      this.editor.setOption("enableLiveAutocompletion", true);
      this.editor.setOption("behavioursEnabled", true); // auto-closing of tags, brackets, etc.

      this.editor.on('change', () => {
        const content = this.editor.getValue();
        this.template.htmlContent = content;
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
    // Your .NET backend should be set up to accept HTML and return PDF
    this.http.post('api/templates/generate-pdf', { htmlContent: this.template.htmlContent }, { responseType: 'blob' }).subscribe(blob => {
      const objectURL = URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
    });
  }
}
