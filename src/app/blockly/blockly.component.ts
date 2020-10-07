import {AfterViewInit, Component, OnInit} from '@angular/core';
declare var Blockly: any;
@Component({
  template: `<div id="blocklyDiv" style="height: 480px; width: 70rem;"></div>`,
  selector: 'app-blockly',
  styleUrls: ['./blockly.component.css']
})
export class BlocklyComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const toolbox = `
      <xml>
      <category name="Control" colour="120">
      <block type="controls_if"></block>
      <block type="controls_repeat_ext" disabled="true"></block>
     </category>
    <category name="Text" colour="230">
      <block type="text"></block>
      <block type="text_print"></block>
    </category>
      </xml>`;
    Blockly.inject('blocklyDiv', { toolbox });
  }

}

