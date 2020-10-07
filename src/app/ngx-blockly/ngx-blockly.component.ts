import { Component, OnInit } from '@angular/core';
import { NgxBlocklyConfig, NgxBlocklyGeneratorConfig } from 'ngx-blockly';
@Component({
  selector: 'app-ngx-blockly',
  templateUrl: './ngx-blockly.component.html',
  styleUrls: ['./ngx-blockly.component.css']
})
export class NgxBlocklyComponent implements OnInit {
  public config: NgxBlocklyConfig = {
    toolbox: '<xml id="toolbox" style="display: none">' +
      '<block type="controls_if"></block>' +
      '<block type="controls_repeat_ext"></block>' +
      '<block type="logic_compare"></block>' +
      '<block type="math_number"></block>' +
      '<block type="math_arithmetic"></block>' +
      '<block type="text"></block>' +
      '<block type="text_print"></block>' +
      '</xml>',
    scrollbars: true,
    trashcan: true
  };


  public generatorConfig: NgxBlocklyGeneratorConfig = {
    dart: true,
    javascript: true,
    lua: true,
    php: true,
    python: true,
    xml: true
  };

  onCode(code: string) {
    console.log(code);
  }
  constructor() { }

  ngOnInit(): void {
  }



}
