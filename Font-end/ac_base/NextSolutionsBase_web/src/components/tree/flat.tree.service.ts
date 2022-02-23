import {FlatTreeConfigConvertObject} from "../../models/flat.tree.config.model";
import {FlatTreeNode} from "../../models/flat.tree.node.model";

export class FlatTreeService {

  static hasChild(_nodeData: FlatTreeNode): boolean {
    return !!_nodeData.children && Array.isArray(_nodeData.children) && _nodeData.children.length > 0;
  }
  static convertTreeToFlatTree(inputData: FlatTreeNode[],
                               config: FlatTreeConfigConvertObject): FlatTreeNode[] {
    if (!inputData) {
      return [];
    }
    inputData.forEach(node => {
      this.setRequiredFlatNoteProperty(node, config);
      if (node.children && node.children.length > 0) {
        this.convertTreeToFlatTree(node.children, config);
      }
    });
    return inputData;
  }

  private static setRequiredFlatNoteProperty(node: any | FlatTreeNode, config: FlatTreeConfigConvertObject): FlatTreeNode {
    node.children = (node.children && node.children.length > 0) ? node.children : null;

    node._displayFuncInput = config.isDynamicConfig ? config.display : typeof (config.display) === 'function' ? config.display(node) : config.display;
    node.display = typeof node._displayFuncInput === 'function' ? node._displayFuncInput(node) : node._displayFuncInput;
    node._disabledFuncInput = config.isDynamicConfig ? config.disabled : typeof (config.disabled) === 'function' ? config.disabled(node) : config.disabled;
    node.disabled = typeof node._disabledFuncInput === 'function' ? node._disabledFuncInput(node) : node._disabledFuncInput;
    return node;
  }
}
